import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AuthContext';
import Avatar from '../Avatar/Avatar';
import { getChatById } from '../../services/chats.services';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../../config/firebase-config';
import { ref, onValue } from 'firebase/database';

export default function ChatBox({ chatId }) {
  const navigate = useNavigate();
  const loggedUser = useContext(AppContext);
  const [chatData, setChatData] = useState({})
  const [lastMessage, setLastMessage] = useState('');
  const [isLastMsgFile, setIsLastMsgFile] = useState(false);
  const [isLastMsgGif, setIsLastMsgGif] = useState(false);
  const [ChatTitle, setChatTitle] = useState('');
  const [areMessagesRead, setAreMessagesRead] = useState(true);

  useEffect(() => {
    getChatById(chatId)
      .then((data) => {
        setChatData(data);
        if(data.isGroup === true) {
          setChatTitle(data.title);
        } else {
          setChatTitle(Object.keys(data.participants).find(user => user !== loggedUser.userData?.handle));
        }

        setLastMessage(data.lastMessage);
        setIsLastMsgGif(data.lastMessage.includes('giphy'));
        setIsLastMsgFile(data.lastMessage.includes('chat_uploads'));
      })
      .catch((e) => {
        toast('Error in getting chat data. Please try again');
        console.log(e.message);
      })
  
    const chatRef = ref(db, `chats/${chatId}`);
    const chatListener = onValue(chatRef, (snapshot) => {
      const updatedChatData = snapshot.val();
      if (updatedChatData) {
        setChatData(updatedChatData);
      }
      if (updatedChatData?.lastMessage){
        setLastMessage(updatedChatData.lastMessage);
      }
      if (updatedChatData?.participantsReadMsg){
        const userLastReadMessage = updatedChatData.participantsReadMsg[loggedUser.userData.handle];
        setAreMessagesRead(userLastReadMessage === updatedChatData.lastMessage);
      }
    });

    return () => {
      chatListener();
    };
  }, [chatId, loggedUser.userData?.handle, lastMessage]);

  return (
    <div onClick={() => navigate(`${chatId}`)} className="w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-lightBlue rounded-lg transition cursor-pointer">
      {chatData?.isGroup === true ? (
        <div className="chat-image avatar w-10 h-10">
          <div className="rounded-full">
            <img src={'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg'} />
          </div>
        </div>
      ) : (
        <Avatar user={ChatTitle} />
      )}
      <div className="min-w-0 flex-1">
      
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium">
              {ChatTitle}
            </p>
          </div>
          <div className="flex justify-between items-center mb-1">
              <p className="text-xs font-medium text-black">
                {isLastMsgGif ? 'GIF' : isLastMsgFile ? 'File Sent' : lastMessage}
              </p>
          </div>
        </div>
      </div>
      <div>{areMessagesRead === true ? <div className='flex w-2 h-2 rounded-full bg-transparent'></div> : (
        <div className='pb-9'>
          <div className='w-2 h-2 rounded-full bg-blue'></div>
        </div>
      )}</div>
    </div>
  )
}

ChatBox.propTypes = {
  chatId: PropTypes.string,
}
