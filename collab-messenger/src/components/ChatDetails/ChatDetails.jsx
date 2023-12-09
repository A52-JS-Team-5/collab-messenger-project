import { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MessagesList from '../MessagesList/MessagesList';
import { createMessage, addMessage } from '../../services/messages.services';
import AppContext from '../../context/AuthContext';
import { db } from '../../config/firebase-config';
import { ref, onValue, query, orderByChild, equalTo, update } from 'firebase/database';
import Avatar from '../Avatar/Avatar';
import ReactGiphySearchbox from 'react-giphy-searchbox-techedge';
import UploadFile from '../UploadFile/UploadFile';
import StatusBubble from '../StatusBubble/StatusBubble';
import ChatInformation from '../ChatInformation/ChatInformation';
import GroupChatAvatar from '../GroupChatAvatar/GroupChatAvatar';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useMediaQuery } from 'react-responsive';
import { getUserByHandle } from '../../services/users.services';
import EmptyList from "../EmptyList/EmptyList";

export default function ChatDetails() {
  const loggedUser = useContext(AppContext);
  const loggedUserHandle = loggedUser.userData?.handle;
  const { chatId } = useParams();
  const [isGifSearchVisible, setIsGifSearchVisible] = useState(false);
  const [isChatInfoVisible, setIsChatInfoVisible] = useState(false);
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const layout = isChatInfoVisible === true ? 'basis-9/12' : 'basis-12/12';
  const [chatData, setChatData] = useState({
    title: '',
    messages: {},
    participants: {}
  });
  const chatTitle = !chatData?.isGroup ? Object.keys(chatData.participants).find(user => user !== loggedUserHandle) : chatData.title;
  const [allMessages, setAllMessages] = useState([]);
  const [message, setMessage] = useState({
    author: '',
    content: '',
    createdOn: '',
    title: ''
  });
  const isLink = message.content.includes('chat_uploads');
  const areThereMessages = allMessages.length > 0;
  const isGroupChat = chatData?.isGroup === true;
  const [noData, setNoData] = useState(false);
  const [loading, setLoading] = useState(true);

  const updateMessage = (field) => (e) => {
    if (field === 'content' && message.content.includes('chat_uploads')) {
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

    createMessage(message.content, loggedUserHandle, chatId)
      .then((messageId) => {
        return addMessage(loggedUserHandle, chatId, messageId, message.content)
      })
      .then(() => {
        setMessage((prevMessage) => ({
          ...prevMessage,
          content: '',
        }));
      })
      .catch((error) => {
        toast('Cannot create message. Please try again.')
        console.log('Error in creating message: ', error.message);
      })
  };

  useEffect(() => {
    const chatRef = ref(db, `chats/${chatId}`);
    const chatListener = onValue(chatRef, (snapshot) => {
      const updatedChatData = snapshot.val();

      if (updatedChatData === null) {
        setNoData(true);
        setLoading(false);
        setChatData(null);
      } else {
        setNoData(false);
        setChatData(updatedChatData);
        setLoading(false);

        if (updatedChatData.messages) {
          setAllMessages(Object.keys(updatedChatData.messages));
        } else {
          setAllMessages([]);
        }

        if (updatedChatData?.participantsReadMsg) {
          const loggedUserLastReadMessage = updatedChatData.participantsReadMsg[loggedUser.userData?.handle];
          const isLatestMessage = loggedUserLastReadMessage === updatedChatData.lastMessage;

          if (!isLatestMessage) {
            const updateUserLastReadMessage = () => {
              const updateMsg = {};
              updateMsg[`/chats/${chatId}/participantsReadMsg/${loggedUser.userData?.handle}`] = updatedChatData.lastMessage;

              return update(ref(db), updateMsg)
                .catch((e) =>
                  console.log(`Error adding last read message to logged user data: `, e.message)
                );
            };
            updateUserLastReadMessage();
          }
        }
      }
    });

    const messagesRef = ref(db, `messages`);
    const chatMessagesQuery = query(messagesRef, orderByChild('chatId'), equalTo(chatId));

    const messagesListener = onValue(chatMessagesQuery, (snapshot) => {
      const updatedMessages = snapshot.val();
      if (updatedMessages) {
        setAllMessages(Object.keys(updatedMessages));
      }
    });

    return () => {
      chatListener();
      messagesListener();
    };
  }, [chatId, loggedUser.userData?.handle]);

  // Show user other participant's name and surname
  const [participantTitle, setParticipantTitle] = useState('');
  useEffect(() => {
    if (!isGroupChat && chatTitle) {
      getUserByHandle(chatTitle)
        .then(user => {
          setParticipantTitle(`${user.name} ${user.surname}`)
        })
        .catch(error => console.log(error))
    }
  }, [chatTitle, isGroupChat])

  // Responsiveness
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1224px)'
  })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

  // Mobile states and functions
  const [activeMobileComponent, setActiveMobileComponent] = useState(0); // 0 For Chat, 1 For ChatInformation

  const handleChatDetailsClick = () => {
    setActiveMobileComponent(1);
  }

  const handleReturnToChat = () => {
    setActiveMobileComponent(0);
  }

  const navigate = useNavigate();

  return (
    <>
      {!noData && isDesktopOrLaptop && !loading && <div id='chatDetails-wrapper' className='flex flex-row w-full gap-3 h-full'>
        <div id='chat-section-layout' className={`${layout} w-full rounded-md bg-pureWhite dark:bg-darkFront`}>
          <div id="header" className="sticky w-full pt-3 flex sm:px-4 py-[1vh] lg:px-6 justify-between items-center shadow-sm border-b border-1 border-grey dark:border-darkInput">
            <div id="header-content" className="flex flex-row gap-3 justify-center">
              <div id='chat-avatar'>
                {isGroupChat === true ? (
                  <GroupChatAvatar />
                ) : (
                  <div className='w-10 relative avatar'>
                    <Avatar user={chatTitle} isGroup={chatData?.isGroup} />
                    <StatusBubble view={'ChatDetails'} userHandle={chatTitle} />
                  </div>
                )}
              </div>
              {!isGroupChat && <div className='flex flex-col'>
                <div id='chat-title' className="flex place-items-end text-md font-semibold">{participantTitle}</div>
                <div id='chat-title' className="flex place-items-end text-xs">@{chatTitle}</div>
              </div>}
              {isGroupChat && <div className='flex flex-col justify-center h-[46.5px]'>
                < div id='chat-title' className="flex place-items-end text-md font-semibold">{chatTitle}</div>
              </div>}
            </div>
            <div className='flex justify-end gap-1'>
              <button className="btn btn-ghost btn-sm" onClick={() => setIsChatInfoVisible(!isChatInfoVisible)}><i className="fa-solid fa-ellipsis text-pink dark:text-yellow"></i></button>
            </div>
          </div>
          <div id='messages-wrapper' className="p-4 h-[70vh] overflow-auto [&::-webkit-scrollbar]:[width:8px]
            [&::-webkit-scrollbar-thumb]:bg-lightBlue [&::-webkit-scrollbar-thumb]:rounded-md p-1 dark:[&::-webkit-scrollbar-thumb]:bg-mint">
            {areThereMessages === true ? (
              <MessagesList chatMessages={allMessages} />
            ) : (
              <p className="self-center">Start a conversation</p>
            )}
          </div>
          <div id='chat-options' className='sticky py-2 px-4 bg-transparent border-t border-1 border-grey dark:border-darkInput flex items-center gap-2 w-full'>
            <div className='flex gap-1'>
              <button id='search-gifs-option' className="hover:cursor-pointer hover:bg-grey btn-xs text-blue bg-transparent flex items-center w-fit " onClick={() => setIsGifSearchVisible(!isGifSearchVisible)}>GIF</button>
              <UploadFile message={message} setMessageFunc={setMessage} component={'ChatDetails'} id={chatId} />
              <button className='hover:cursor-pointer hover:bg-grey btn-xs text-black bg-transparent flex items-center w-fit' onClick={() => setIsEmojiPickerVisible(!isEmojiPickerVisible)}><i className="fa-solid fa-face-smile text-blue"></i></button>
            </div>
            <textarea id='add-message-option' className="text-black bg-grey font-light py-2 px-4 w-full h-10 rounded-full focus:outline-none" placeholder="Type a message" value={isLink ? '' : message.content} onChange={updateMessage('content')}></textarea>
            <button id='send-message-option' onClick={onReply} className="p-2w-full rounded-full bg-blue cursor-pointer hover:bg-darker-blue text-pureWhite transition"><i className="fa-regular fa-paper-plane"></i></button>
          </div>
          {isGifSearchVisible === true && (
            <div id='giphy-searchbox-wrapper' className='fixed bottom-32'>
              <ReactGiphySearchbox
                apiKey="Iy7WxBnblvFgo3jx4SFOIte0fBIDKY0X"
                onSelect={gif => addGif(gif.images.fixed_height.url)}
                rating
                wrapperClassName='bg-white !w-[280px] p-2 rounded-md'
                searchFormClassName='bg-!blue'
                listWrapperClassName='[&::-webkit-scrollbar]:[width:8px] [&::-webkit-scrollbar-thumb]:bg-lightBlue [&::-webkit-scrollbar-thumb]:rounded-md'
              />
            </div>
          )}
          {isEmojiPickerVisible === true && (
            <div className='fixed bottom-32'>
              <Picker
                data={data}
                onEmojiSelect={(e) => addEmoji(e.native)}
                theme={'light'}
              />
            </div>
          )}
        </div>
        {isChatInfoVisible === true && (
          <div id='chatInformation-section-layout' className={`basis-3/12 bg-pureWhite w-full rounded-md dark:bg-darkFront`}>
            <ChatInformation isGroupChat={isGroupChat} chatTitle={chatTitle} chatId={chatId} chatData={chatData} />
          </div>
        )}
      </div>}
      {!noData && isTabletOrMobile && !loading && <div id='chatDetails-wrapper' className='flex flex-row w-full gap-3 max-h-fit'>
        {activeMobileComponent === 0 && <div id='chat-section-layout' className={`${layout} w-full rounded-md bg-pureWhite dark:bg-darkFront p-2`}>
          <div id="header" className="sticky w-full pt-2 flex flex-row sm:px-4 py-[1vh] lg:px-6 justify-between items-center shadow-sm border-b border-1 border-grey dark:border-darkInput">
            <div id="header-content" className="flex gap-2 flex-row justify-center">
              <div className='flex flex-start'>
                <button className='btn btn-ghost' onClick={() => navigate('/app/chats')}><i className="fa-solid fa-arrow-left"></i></button>
              </div>
              <div id='chat-avatar' className="flex flex-row gap-3 justify-center items-center">
                {isGroupChat === true ? (
                  <GroupChatAvatar />
                ) : (
                  <div className='w-10 relative avatar'>
                    <Avatar user={chatTitle} />
                    <StatusBubble view={'ChatDetails-Mobile'} userHandle={chatTitle} />
                  </div>
                )}
                {!isGroupChat && <div className='flex flex-col'>
                  < div id='chat-title' className="flex place-items-end text-md font-semibold">{participantTitle}</div>
                  <div id='chat-title' className="flex place-items-end text-xs">@{chatTitle}</div>
                </div>}
                {isGroupChat && <div className='flex flex-col justify-center h-[46.5px]'>
                  < div id='chat-title' className="flex place-items-end text-md font-semibold">{chatTitle}</div>
                </div>}
              </div>
            </div>
            <div className='flex justify-end gap-1'>
              <button className="btn btn-ghost btn-sm" onClick={handleChatDetailsClick}><i className="fa-solid fa-ellipsis text-pink dark:text-yellow"></i></button>
            </div>
          </div>
          <div id='messages-wrapper' className="p-4 h-[61vh] overflow-auto [&::-webkit-scrollbar]:[width:8px]
            [&::-webkit-scrollbar-thumb]:bg-lightBlue [&::-webkit-scrollbar-thumb]:rounded-md p-1 dark:[&::-webkit-scrollbar-thumb]:bg-mint">
            {areThereMessages === true ? (
              <MessagesList chatMessages={allMessages} />
            ) : (
              <p className="self-center">Start a conversation</p>
            )}
          </div>
          <div id='chat-options' className='sticky py-2 bg-transparent border-t border-1 border-grey dark:border-darkInput flex flex-col items-center gap-2 w-full'>
            <div className='flex gap-1 w-full'>
              <button id='search-gifs-option' className="hover:cursor-pointer hover:bg-grey btn-xs text-blue bg-transparent flex items-center w-fit " onClick={() => setIsGifSearchVisible(!isGifSearchVisible)}>GIF</button>
              <UploadFile message={message} setMessageFunc={setMessage} component={'ChatDetails'} id={chatId} />
              <button className='hover:cursor-pointer hover:bg-grey btn-xs text-black bg-transparent flex items-center w-fit' onClick={() => setIsEmojiPickerVisible(!isEmojiPickerVisible)}><i className="fa-solid fa-face-smile text-blue"></i></button>
            </div>
            <div className='flex flex-row gap-2 w-full'>
              <textarea id='add-message-option' className="text-black bg-grey font-light py-2 px-4 w-full h-10 rounded-full focus:outline-none" placeholder="Type a message" value={isLink ? '' : message.content} onChange={updateMessage('content')}></textarea>
              <button id='send-message-option' onClick={onReply} className="p-2w-full rounded-full bg-blue cursor-pointer hover:bg-darker-blue text-pureWhite transition"><i className="fa-regular fa-paper-plane"></i></button>
            </div>
          </div>
          {isGifSearchVisible === true && (
            <div id='giphy-searchbox-wrapper' className='fixed bottom-44'>
              <ReactGiphySearchbox
                apiKey="Iy7WxBnblvFgo3jx4SFOIte0fBIDKY0X"
                onSelect={gif => addGif(gif.images.fixed_height.url)}
                rating
                wrapperClassName='bg-white !w-[280px] p-2 rounded-md'
                searchFormClassName='bg-!blue'
                listWrapperClassName='[&::-webkit-scrollbar]:[width:8px] [&::-webkit-scrollbar-thumb]:bg-lightBlue [&::-webkit-scrollbar-thumb]:rounded-md'
              />
            </div>
          )}
          {isEmojiPickerVisible === true && (
            <div className='fixed bottom-44'>
              <Picker
                data={data}
                onEmojiSelect={(e) => addEmoji(e.native)}
                theme={'light'}
              />
            </div>
          )}
        </div>}
        {activeMobileComponent === 1 && (
          <div id='chatInformation-section-layout' className={`bg-pureWhite w-full rounded-md dark:bg-darkFront`}>
            <div className='flex flex-start'>
              <button className='btn btn-ghost' onClick={handleReturnToChat}><i className="fa-solid fa-arrow-left"></i></button>
            </div>
            <ChatInformation isGroupChat={isGroupChat} chatTitle={chatTitle} chatId={chatId} chatData={chatData} />
          </div>
        )}
      </div>
      }
      {noData && !loading && <EmptyList content={`Hmm, looks like there's no available data for this chat.`} />}
    </>
  )
}
