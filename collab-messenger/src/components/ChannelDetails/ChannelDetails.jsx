import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from "react";
import AppContext from "../../context/AuthContext";
import { toast } from "react-toastify";
import { addMessageChannel } from "../../services/messages.services";
import { createChannelMessage } from "../../services/messages.services";
import { getChannelById } from "../../services/channels.services";
import { db } from '../../config/firebase-config';
import { ref, onValue, query, orderByChild, equalTo, update } from 'firebase/database';
import MessagesList from '../MessagesList/MessagesList';
import { useParams } from "react-router-dom";
import ReactGiphySearchbox from 'react-giphy-searchbox-techedge';
import UploadFile from '../UploadFile/UploadFile';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

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

  const channelTitle = channelData.title;
  const [allMessages, setAllMessages] = useState([]);
  const [message, setMessage] = useState({
    author: '',
    content: '',
    createdOn: '',
    title: '',
  });

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
    getChannelById(channelId)
      .then((data) => {
        setChannelData(data);
        if (data.messages) {
          setAllMessages(Object.keys(data.messages))
        } else {
          setAllMessages([]);
        }
      })
      .catch((e) => {
        toast('Error in getting channel data. Please try again.')
        console.log(e.message);
      });

      const channelRef = ref(db, `channels/${channelId}`);
      const channelListener = onValue(channelRef, (snapshot) => {
        const updatedChannelData = snapshot.val();
        if (updatedChannelData) {
          setChannelData(updatedChannelData);

          if (updatedChannelData.messages) {
            setAllMessages(Object.keys(updatedChannelData.messages));
          }
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
      });

      const channelsRef = ref(db, 'messages');
      const channelMessagesQuery = query(channelsRef, orderByChild('channelId'), equalTo(channelId));

      const messagesListener = onValue(channelMessagesQuery, (snapshot) => {
        const updatedMessages = snapshot.val();
        if(updatedMessages) {
          setAllMessages(Object.keys(updatedMessages));
        }
      })

      return () => {
        channelListener();
        messagesListener();
      };
  }, [channelId, loggedUser.userData?.handle]);

  return (
    <div id='chat-details-wrapper' className="flex flex-col w-full gap-3">
      <div id='chat-section-layout' className='w-full bg-pureWhite border-b border-1 border-grey'>
        <div id="header" className="sticky w-full flex py-[1vh] h-[4vh] px-6 justify-between items-center">
          <div id="header-content" className="flex gap-3">
            <div id='chat-title' className="flex place-items-end">{channelTitle}</div> 
          </div>
          <div className='flex justify-end gap-1'>
            <button className="btn btn-ghost btn-sm" onClick={() => {setIsChannelInfoVisible(!isChannelInfoVisible)}}><i className="fa-solid fa-ellipsis text-pink"></i></button>
          </div>
        </div>
      </div>

      <div id='messages-wrapper' className="p-3 h-[64vh] overflow-auto [&::-webkit-scrollbar]:[width:8px]
        [&::-webkit-scrollbar-thumb]:bg-lightBlue [&::-webkit-scrollbar-thumb]:rounded-md p-1">
        {areThereMessages === true ? (
          <MessagesList chatMessages={allMessages} />
        ) : (
          <p className="self-center">Start a conversation</p>
        )}
      </div>
      <div id='chat-options' className='sticky py-2 px-4 bg-transparent border-t flex items-center gap-2 w-full'>
        <div className='flex gap-1'>
          <button id='search-gifs-option' className="hover:cursor-pointer hover:bg-grey btn-xs text-blue bg-transparent flex items-center w-fit " onClick={() => setIsGifSearchVisible(!isGifSearchVisible)}>GIF</button>
          <UploadFile message={message} setMessageFunc={setMessage} component={'ChannelDetails'} id={channelId} />
          <button className='hover:cursor-pointer hover:bg-grey btn-xs text-black bg-transparent flex items-center w-fit' onClick={() => setIsEmojiPickerVisible(!isEmojiPickerVisible)}><i className="fa-solid fa-face-smile text-blue"></i></button>
        </div>
        <textarea id='add-message-option' className="text-black bg-grey font-light py-2 px-4 bg-neutral-100 w-full h-10 rounded-full focus:outline-none" placeholder="Type a message" value={isLink ? '' : message.content} onChange={updateMessage('content')}></textarea>
        {<button id='send-message-option' onClick={onReply} className="p-2w-full rounded-full bg-lightBlue cursor-pointer hover:bg-sky-600 transition"><i className="fa-regular fa-paper-plane"></i></button>}
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
    </div>
  )
}

ChannelDetails.propTypes = {
  isChannelInfoVisible: PropTypes.bool,
  setIsChannelInfoVisible: PropTypes.func
};
