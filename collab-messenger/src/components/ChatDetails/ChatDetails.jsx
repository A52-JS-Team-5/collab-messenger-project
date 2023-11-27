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
import LeaveChatModal from '../LeaveChatModal/LeaveChatModal';
import ReactGiphySearchbox from 'react-giphy-searchbox-techedge';
import UploadFile from '../UploadFile/UploadFile';

export default function ChatDetails() {
  const loggedUser = useContext(AppContext);
  const { chatId } = useParams();
  const [isGifSearchVisible, setIsGifSearchVisible] = useState(false);
  const [chatData, setChatData] = useState({
    title: '',
    messages: {},
    participants: []
  });
  const chatTitle = chatData?.isGroup === false ? Object.keys(chatData.participants).find(user => user !== loggedUser?.userData?.handle) : chatData.title;
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
  
  const onReply = (event) => {
    event.preventDefault();

    if (!message.content) {
      toast('Content is required!');
      return;
    }

    createMessage(message.content, loggedUser.userData.handle, chatId)
      .then((messageId) => {
        return addMessage(loggedUser.userData.handle, chatId, messageId, message.content)
      })
      .then(() => {
        setMessage((prevMessage) => ({
          ...prevMessage,
          content: '',
        }));
      })
      .catch((error) => {
        toast('Cannot create message. Please try again.')
        console.log('Error in creating message', error.message);
      })
  };

  useEffect(() => {
    getChatById(chatId)
      .then((data) => {
        setChatData(data);
        if (data.messages) {
          setAllMessages(Object.keys(data.messages))
        } else {
          setAllMessages([]);
        }
      })
      .catch((e) => {
        toast('Error in getting chat data. Please try again.')
        console.log(e.message);
      })
    
      const chatRef = ref(db, `chats/${chatId}`);
      const chatListener = onValue(chatRef, (snapshot) => {
        const updatedChatData = snapshot.val();
        if (updatedChatData) {
          setChatData(updatedChatData);

          if (updatedChatData.messages) {
            setAllMessages(Object.keys(updatedChatData.messages))
          }
        }
        
        if (updatedChatData?.participantsReadMsg) {
          const loggedUserLastReadMessage = updatedChatData.participantsReadMsg[loggedUser.userData.handle];
          const isLatestMessage = loggedUserLastReadMessage === updatedChatData.lastMessage;

          if (!isLatestMessage){
            const updateUserLastReadMessage = () => {
              const updateMsg = {};
              updateMsg[`/chats/${chatId}/participantsReadMsg/${loggedUser.userData.handle}`] = updatedChatData.lastMessage;

              return update(ref(db), updateMsg)
                .catch((e) =>
                  console.log(`Error adding last read message to logged user data`, e.message)
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
          setAllMessages(Object.keys(updatedMessages))
        }
      })
  
      return () => {
        chatListener();
        messagesListener();
      };
  }, [chatId, loggedUser.userData?.handle]);

  return (
    <div id='chat-details-wrapper' className="w-full h-[90vh] overflow-y-auto bg-w [&::-webkit-scrollbar]:[width:8px]
      [&::-webkit-scrollbar-thumb]:bg-lightBlue [&::-webkit-scrollbar-thumb]:rounded-md p-1">
      <div id="header" className="sticky w-full flex border-b-[0.5px] sm:px-4 py-3 lg:px-6 justify-between items-center shadow-sm">
        <div id="header-content" className="flex gap-3 items-center">
          <div id='chat-avatar' className="flex flex-row gap-3">
            {isGroupChat === true ? (
              <div className="chat-image avatar w-10 h-10">
                <div className="rounded-full">
                  <img src={'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg'} />
                </div>
              </div>
            ) : (
              <Avatar user={chatTitle} />
              // {/* <div className="flex flex-col text-sm font-light text-neutral-500">Active</div> */}
            )}
            <div id='chat-title' className="flex place-items-end">{chatTitle}</div> 
          </div>
        </div>
        {isGroupChat && <LeaveChatModal chatId={chatId} />}
      </div>
      <div id='messages-wrapper' className="p-4 h-[70vh] overflow-auto [&::-webkit-scrollbar]:[width:8px]
          [&::-webkit-scrollbar-thumb]:bg-mint [&::-webkit-scrollbar-thumb]:rounded-md p-1">
        {areThereMessages === true ? (
          <MessagesList chatMessages={allMessages} />
        ) : (
          <p className="self-center">Start a conversation</p>
        )}
      </div>
      <div id='chat-options' className='sticky py-2 px-4 bg-transparent border-t flex items-center gap-2 lg:gap-4 w-full'>
        <span id='search-gifs-option' className="hover:cursor-pointer hover:bg-mint btn btn-sm text-black bg-transparent flex items-center w-fit " onClick={() => setIsGifSearchVisible(!isGifSearchVisible)}>GIF</span>
        <UploadFile message={message} setMessageFunc={setMessage} />
        <textarea id='add-message-option' className="text-black bg-white font-light py-2 px-4 bg-neutral-100 w-full h-10 rounded-full focus:outline-none" placeholder="Type a message" value={isLink ? '' : message.content} onChange={updateMessage('content')}></textarea>
        {<button id='send-message-option' onClick={onReply} className="p-2w-full rounded-full bg-mint cursor-pointer hover:bg-sky-600 transition"><i className="fa-regular fa-paper-plane"></i></button>}
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
    </div>
  )
}