import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getChatById } from '../../services/chats.services';
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
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

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

  const updateMessage = (field) => (e) => {
    if(field === 'content' && message.content.includes('chat_uploads')) {
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
    getChatById(chatId)
      .then((data) => {
        setChatData(data);

        if (data.messages) {
          setAllMessages(Object.keys(data.messages));
        } else {
          setAllMessages([]);
        }
      })
      .catch((e) => {
        toast('Error in getting chat data. Please try again.')
        console.log('Error in getting chat data: ', e.message);
      });
    
      const chatRef = ref(db, `chats/${chatId}`);
      const chatListener = onValue(chatRef, (snapshot) => {
        const updatedChatData = snapshot.val();
        if (updatedChatData) {
          setChatData(updatedChatData);

          if (updatedChatData.messages) {
            setAllMessages(Object.keys(updatedChatData.messages));
          }
        }
        
        if (updatedChatData?.participantsReadMsg) {
          const loggedUserLastReadMessage = updatedChatData.participantsReadMsg[loggedUser.userData?.handle];
          const isLatestMessage = loggedUserLastReadMessage === updatedChatData.lastMessage;

          if (!isLatestMessage){
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
      });
  
      const messagesRef = ref(db, `messages`);
      const chatMessagesQuery = query(messagesRef, orderByChild('chatId'), equalTo(chatId));
      
      const messagesListener = onValue(chatMessagesQuery, (snapshot) => {
        const updatedMessages = snapshot.val();
        if(updatedMessages) {
          setAllMessages(Object.keys(updatedMessages));
        }
      });
  
      return () => {
        chatListener();
        messagesListener();
      };
  }, [chatId, loggedUser.userData?.handle]);

  return (
    <div id='chatDetails-wrapper' className='flex flex-row w-full gap-3 h-full'>
      <div id='chat-section-layout' className={`${layout} w-full rounded-md bg-pureWhite dark:bg-darkFront`}>
        <div id="header" className="sticky w-full pt-3 flex sm:px-4 py-[1vh] lg:px-6 justify-between items-center shadow-sm">
          <div id="header-content" className="flex gap-3 items-center">
            <div id='chat-avatar' className="flex flex-row gap-3">
              {isGroupChat === true ? (
                <GroupChatAvatar />
              ) : (
                <div>
                  <Avatar user={chatTitle} isGroup={chatData?.isGroup} />
                  <StatusBubble view={'ChatDetails'} userHandle={chatTitle} />
                </div>
              )}
              <div id='chat-title' className="flex place-items-end mb-1">{chatTitle}</div> 
            </div>
          </div>
          <div className='flex justify-end gap-1'>
            <button className="btn btn-ghost btn-sm" onClick={() => setIsChatInfoVisible(!isChatInfoVisible)}><i className="fa-solid fa-ellipsis text-pink dark:text-yellow"></i></button>
          </div>
        </div>
        <div id='messages-wrapper' className="p-4 h-[68vh] overflow-auto [&::-webkit-scrollbar]:[width:8px]
            [&::-webkit-scrollbar-thumb]:bg-lightBlue [&::-webkit-scrollbar-thumb]:rounded-md p-1 dark:[&::-webkit-scrollbar-thumb]:bg-mint">
          {areThereMessages === true ? (
            <MessagesList chatMessages={allMessages} />
          ) : (
            <p className="self-center">Start a conversation</p>
          )}
        </div>
        <div id='chat-options' className='sticky py-2 px-4 bg-transparent border-t flex items-center gap-2 w-full'>
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
    </div>
  )
}
