import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from "react";
import AppContext from "../../context/AuthContext";
import { toast } from "react-toastify";
import { addMessageChannel } from "../../services/messages.services";
import { createChannelMessage } from "../../services/messages.services";
import { db } from '../../config/firebase-config';
import { ref, onValue, query, orderByChild, equalTo, update } from 'firebase/database';
import MessagesList from '../MessagesList/MessagesList';
import { useParams } from "react-router-dom";
import ReactGiphySearchbox from 'react-giphy-searchbox-techedge';
import UploadFile from '../UploadFile/UploadFile';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useMediaQuery } from 'react-responsive';
import EmptyList from "../EmptyList/EmptyList";

export default function ChannelDetails({ isChannelInfoVisible, setIsChannelInfoVisible }) {
  const loggedUser = useContext(AppContext);
  const { channelId } = useParams();
  const [isGifSearchVisible, setIsGifSearchVisible] = useState(false);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [channelData, setChannelData] = useState({
    title: '',
    messages: {},
    participants: [],
  });
  const [allMessages, setAllMessages] = useState([]);
  const [message, setMessage] = useState({
    author: '',
    content: '',
    createdOn: '',
    title: '',
  });
  const [noData, setNoData] = useState(false);
  const [loading, setLoading] = useState(true);

  const isLink = message.content.includes('channel_uploads');
  const areThereMessages = allMessages.length > 0;

  const updateMessage = (field) => (e) => {
    if (field === 'content' && message.content.includes('channel_uploads')) {
      setMessage({
        ...message,
        ['content']: '',
      });
    } else {
      setMessage({
        ...message,
        [field]: e.target.value,
      });
    }
  };

  const addGif = (gif) => {
    setMessage({
      ...message,
      content: `${gif}`,
    });
  };

  const addEmoji = (emoji) => {
    setMessage({
      ...message,
      content: message['content'] + `${emoji}`,
    });
  };

  const onReply = (event) => {
    event.preventDefault();

    if (!message.content) {
      toast('Content is required!');
      return;
    }

    createChannelMessage(message.content, loggedUser.userData.handle, channelId)
      .then((messageId) => {
        return addMessageChannel(channelId, messageId, message.content, loggedUser.userData.handle)
      })
      .then(() => {
        setMessage((prevMessage) => ({
          ...prevMessage,
          content: '',
        }));
      })
      .catch((e) => {
        toast('Cannot create message. Please try again.')
        console.log(`Error in creating message: ${e.message}`);
      });
  };

  useEffect(() => {
    const channelRef = ref(db, `channels/${channelId}`);
    const channelListener = onValue(channelRef, (snapshot) => {
      const updatedChannelData = snapshot.val();

      if (updatedChannelData === null) {
        setNoData(true);
        setLoading(false);
        setChannelData(null);
      } else {
        setChannelData(updatedChannelData);
        setNoData(false);
        setLoading(false);

        if (updatedChannelData.messages) {
          setAllMessages(Object.keys(updatedChannelData.messages));
        } else {
          setAllMessages([]);
        }

        if (updatedChannelData?.participantsReadMsg) {
          const loggedUserLastReadMessage = updatedChannelData.participantsReadMsg[loggedUser.userData.handle];
          const isLatestMessage = loggedUserLastReadMessage === updatedChannelData.isLatestMessage;

          if (!isLatestMessage) {
            const updateUserLastReadMessage = () => {
              const updateMsg = {};
              updateMsg[`/channels/${channelId}/participantsReadMsg/${loggedUser.userData.handle}`] = updatedChannelData.lastMessage;

              return update(ref(db), updateMsg)
                .catch((e) =>
                  console.log(`Error adding last read message to logged user data: ${e.message}`)
                );
            }
            updateUserLastReadMessage();
          }
        }
      }
    });

    const channelsRef = ref(db, 'messages');
    const channelMessagesQuery = query(channelsRef, orderByChild('channelId'), equalTo(channelId));

    const messagesListener = onValue(channelMessagesQuery, (snapshot) => {
      const updatedMessages = snapshot.val();
      if (updatedMessages) {
        setAllMessages(Object.keys(updatedMessages));
      }
    })

    return () => {
      channelListener();
      messagesListener();
    };
  }, [channelId, loggedUser.userData?.handle]);

  // Responsiveness
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1224px)'
  })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

  return (
    <>
      {isDesktopOrLaptop && !noData && !loading &&
        <div id='chat-details-wrapper' className="flex flex-col w-full h-full">
          <div id='chat-section-layout' className='sticky w-full pt-3 pb-3 flex sm:px-4 py-[1vh] lg:px-6 justify-between items-center shadow-sm border-b border-1 border-grey dark:border-darkInput dark:text-darkText'>
            <div id="header" className="sticky w-full flex py-[1vh] h-[4vh] px-1 justify-between items-center">
              <div id="header-content" className="flex gap-3">
                <div id='chat-title' className="flex place-items-end font-medium">{channelData?.title}</div>
              </div>
              <div className='flex justify-end gap-1'>
                <button className="btn btn-ghost btn-sm" onClick={() => { setIsChannelInfoVisible(!isChannelInfoVisible) }}><i className="fa-solid fa-ellipsis text-pink dark:text-yellow"></i></button>
              </div>
            </div>
          </div>
          <div id='messages-wrapper' className="p-3 h-[67vh] overflow-auto [&::-webkit-scrollbar]:[width:8px]
        [&::-webkit-scrollbar-thumb]:bg-lightBlue [&::-webkit-scrollbar-thumb]:rounded-md p-1 dark:text-darkText">
            {areThereMessages === true ? (
              <MessagesList chatMessages={allMessages} />
            ) : (
              <p className="self-center">Start a conversation</p>
            )}
          </div>
          <div id='chat-options' className='sticky py-2 px-4 bg-transparent border-t border-1 border-grey dark:border-darkInput flex items-center gap-2 w-full'>
            <div className='flex gap-1'>
              <button id='search-gifs-option' className="hover:cursor-pointer hover:bg-grey btn-xs text-blue bg-transparent flex items-center w-fit " onClick={() => setIsGifSearchVisible(!isGifSearchVisible)}>GIF</button>
              <UploadFile message={message} setMessageFunc={setMessage} component={'ChannelDetails'} id={channelId} />
              <button className='hover:cursor-pointer hover:bg-grey btn-xs text-black bg-transparent flex items-center w-fit' onClick={() => setIsEmojiPickerVisible(!isEmojiPickerVisible)}><i className="fa-solid fa-face-smile text-blue"></i></button>
            </div>
            <textarea id='add-message-option' className="text-black bg-grey font-light py-2 px-4 bg-neutral-100 w-full h-10 rounded-full focus:outline-none" placeholder="Type a message" value={isLink ? '' : message.content} onChange={updateMessage('content')}></textarea>
            {<button id='send-message-option' onClick={onReply} className="p-2w-full rounded-full bg-blue cursor-pointer hover:bg-darker-blue transition text-pureWhite"><i className="fa-regular fa-paper-plane"></i></button>}
          </div>
          {isGifSearchVisible === true && (
            <div id='giphy-searchbox-wrapper' className='fixed bottom-24'>
              <ReactGiphySearchbox
                apiKey="Iy7WxBnblvFgo3jx4SFOIte0fBIDKY0X"
                onSelect={gif => addGif(gif.images.fixed_height.url)}
                rating
                wrapperClassName=''
                searchFormClassName='bg-blue text-black w-[270px]'
                listWrapperClassName='w-[270px] border-[0.5px]'
              />
            </div>
          )}
          {isEmojiPickerVisible === true && (
            <div className='fixed bottom-24'>
              <Picker
                data={data}
                onEmojiSelect={(e) => addEmoji(e.native)}
                theme={'light'}
              />
            </div>
          )}
        </div>}
      {isTabletOrMobile && !noData && !loading &&
        <div id='chat-details-wrapper' className="flex flex-col w-full gap-3">
          <div id='chat-section-layout' className='w-full shadow-sm border-b border-1 border-grey dark:border-darkInput'>
            <div id="header" className="sticky w-full flex py-[1vh] h-[4vh] justify-between items-center">
              <div id="header-content" className="flex gap-3">
                <div id='chat-title' className="flex place-items-end">{channelData?.title}</div>
              </div>
              <div className='flex justify-end gap-1'>
                <button className="btn btn-ghost btn-sm" onClick={() => { setIsChannelInfoVisible(!isChannelInfoVisible) }}><i className="fa-solid fa-ellipsis text-pink dark:text-yellow"></i></button>
              </div>
            </div>
          </div>

          <div id='messages-wrapper' className="p-3 h-[55.7vh] overflow-auto [&::-webkit-scrollbar]:[width:8px]
        [&::-webkit-scrollbar-thumb]:bg-lightBlue [&::-webkit-scrollbar-thumb]:rounded-md p-1">
            {areThereMessages === true ? (
              <MessagesList chatMessages={allMessages} />
            ) : (
              <p className="self-center">Start a conversation</p>
            )}
          </div>
          <div id='chat-options' className='sticky pt-2 bg-transparent border-t border-1 border-grey dark:border-darkInput flex flex-col items-center gap-2 w-full'>
            <div className='flex gap-1 w-full'>
              <button id='search-gifs-option' className="hover:cursor-pointer hover:bg-grey btn-xs text-blue bg-transparent flex items-center w-fit " onClick={() => setIsGifSearchVisible(!isGifSearchVisible)}>GIF</button>
              <UploadFile message={message} setMessageFunc={setMessage} component={'ChannelDetails'} id={channelId} />
              <button className='hover:cursor-pointer hover:bg-grey btn-xs text-black bg-transparent flex items-center w-fit' onClick={() => setIsEmojiPickerVisible(!isEmojiPickerVisible)}><i className="fa-solid fa-face-smile text-blue"></i></button>
            </div>
            <div className='flex flex-row gap-2 w-full'>
              <textarea id='add-message-option' className="text-black bg-grey font-light py-2 px-4 w-full h-10 rounded-full focus:outline-none" placeholder="Type a message" value={isLink ? '' : message.content} onChange={updateMessage('content')}></textarea>
              <button id='send-message-option' onClick={onReply} className="p-2w-full rounded-full bg-blue cursor-pointer hover:bg-darker-blue text-pureWhite transition"><i className="fa-regular fa-paper-plane"></i></button>
            </div>
          </div>
          {isGifSearchVisible === true && (
            <div id='giphy-searchbox-wrapper' className='fixed bottom-24'>
              <ReactGiphySearchbox
                apiKey="Iy7WxBnblvFgo3jx4SFOIte0fBIDKY0X"
                onSelect={gif => addGif(gif.images.fixed_height.url)}
                rating
                wrapperClassName=''
                searchFormClassName='bg-blue text-black w-[270px]'
                listWrapperClassName='w-[270px] border-[0.5px]'
              />
            </div>
          )}
          {isEmojiPickerVisible === true && (
            <div className='fixed bottom-24'>
              <Picker
                data={data}
                onEmojiSelect={(e) => addEmoji(e.native)}
                theme={'light'}
              />
            </div>
          )}
        </div>}
      {noData && !loading && <EmptyList content={`Hmm, looks like there's no available data for this channel.`} />}
    </>
  )
}

ChannelDetails.propTypes = {
  isChannelInfoVisible: PropTypes.bool,
  setIsChannelInfoVisible: PropTypes.func
};
