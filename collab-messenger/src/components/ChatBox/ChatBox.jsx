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
  const [chatData, setChatData] = useState({
    lastMessage: ''
  })
  const isGif = chatData.lastMessage.includes('giphy');
  const [title, setTitle] = useState('');

  useEffect(() => {
    getChatById(chatId)
      .then((data) => {
        setChatData(data);
        if(data.isGroup === true) {
          setTitle(data.title);
        } else {
          setTitle(Object.keys(data.participants).find(user => user !== loggedUser.userData?.handle));
        }
      })
      .catch((e) => {
        toast('Error in getting chat data. Please try again')
        console.log(e.message);
      })
  
    const chatRef = ref(db, `chats/${chatId}`);
    const chatListener = onValue(chatRef, (snapshot) => {
      const updatedChatData = snapshot.val();
      if (updatedChatData) {
        setChatData(updatedChatData);
      }
    });

    return () => {
      chatListener();
    };
  }, [chatId, loggedUser.userData?.handle])

  return (
    <div onClick={() => navigate(`${chatId}`)} className="w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-lightBlue rounded-lg transition cursor-pointer">
      {chatData?.isGroup === true ? (
        <div className="chat-image avatar w-10 h-10">
          <div className="rounded-full">
            <img src={'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg'} />
          </div>
        </div>
      ) : (
        <Avatar user={title} />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium">
              {title}
            </p>
          </div>
          <div className="flex justify-between items-center mb-1">
            {isGif === true ? (
              <p className="text-xs font-medium text-black">
                GIF
              </p>
            ) : (
              <p className="text-xs font-medium text-black">
                {chatData?.lastMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

ChatBox.propTypes = {
  chatId: PropTypes.string,
}
