import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getChatById } from '../../services/chats.services';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MessagesList from '../MessagesList/MessagesList';
import { createMessage, addMessage } from '../../services/messages.services';
import AppContext from '../../context/AuthContext';
import { db } from '../../config/firebase-config';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import Avatar from '../Avatar/Avatar';
import LeaveChatModal from '../LeaveChatModal/LeaveChatModal';
import ReactGiphySearchbox from 'react-giphy-searchbox-techedge';

export default function ChatDetails() {
  const loggedUser = useContext(AppContext);
  const { chatId } = useParams();
  const [searchVisible, setSearchVisible] = useState(false);
  const [chatData, setChatData] = useState({
    title: '',
    messages: {},
    participants: []
  });
  const title = chatData?.isGroup === false ? Object.keys(chatData.participants).find(user => user !== loggedUser?.userData?.handle) : chatData.title;
  const [allMessages, setAllMessages] = useState([]);
  const [message, setMessage] = useState({
    author: '',
    content: '',
    createdOn: '',
  });

  const updateMessage = (field) => (e) => {
    setMessage({
      ...message,
      [field]: e.target.value,
    });
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
  }, [chatId])

  return (
    <div className="w-full h-[90vh] overflow-y-auto bg-w [&::-webkit-scrollbar]:[width:8px]
    [&::-webkit-scrollbar-thumb]:bg-lightBlue [&::-webkit-scrollbar-thumb]:rounded-md p-1">
      <div id="header" className=" sticky w-full flex border-b-[0.5px] sm:px-4 py-3 ph-4 lg:px-6 justify-between items-center shadow-sm">
        <div className="flex gap-3 items-center">
          <div className="flex flex-row gap-3">
            {chatData?.isGroup === true ? (
              <div className="chat-image avatar w-10 h-10">
                <div className="rounded-full">
                  <img src={'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg'} />
                </div>
              </div>
            ) : (
              <Avatar user={title} />
            )}
            <div className="flex place-items-end">{title}</div> 
            {/* <div className="flex flex-col text-sm font-light text-neutral-500">Active</div> */}
          </div>
        </div>
        {chatData?.isGroup === true && <LeaveChatModal chatId={chatId} />}
      </div>
      <div className="p-4 h-[70vh] overflow-auto [&::-webkit-scrollbar]:[width:8px]
          [&::-webkit-scrollbar-thumb]:bg-mint [&::-webkit-scrollbar-thumb]:rounded-md p-1">
        {allMessages.length > 0 ? (
          <MessagesList chatMessages={allMessages} />
        ) : (
          <p className="self-center">Select a chat or start a new conversation</p>
        )}
      </div>
      <div className='sticky py-4 px-4 bg-transparent border-t flex items-center gap-2 lg:gap-4 w-full'>
      <span className="hover:cursor-pointer hover:bg-mint btn btn-sm text-black bg-transparent flex items-center w-fit m-1 " onClick={() => setSearchVisible(!searchVisible)}>GIF</span>
        <textarea className="text-black bg-white font-light py-2 px-4 bg-neutral-100 w-full h-10 rounded-full focus:outline-none" placeholder="Type a message" value={message.content} onChange={updateMessage('content')}></textarea>
        {<button onClick={onReply} className="p-2w-full rounded-full bg-mint cursor-pointer hover:bg-sky-600 transition"><i className="fa-regular fa-paper-plane"></i></button>}
      </div>
      {searchVisible === true && (
        <div className='fixed bottom-20 right-40'>
          <ReactGiphySearchbox
            apiKey="Iy7WxBnblvFgo3jx4SFOIte0fBIDKY0X" 
            onSelect={gif => addGif(gif.images.fixed_height.url)}
            rating
          />
        </div>
      )}
    </div>
  )
}