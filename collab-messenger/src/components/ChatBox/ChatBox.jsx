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
import StatusBubble from '../StatusBubble/StatusBubble';
import GroupChatAvatar from '../GroupChatAvatar/GroupChatAvatar';

export default function ChatBox({ chatId }) {
  const navigate = useNavigate();
  const loggedUser = useContext(AppContext);
  const [chatData, setChatData] = useState({})
  const [lastMessage, setLastMessage] = useState('');
  const [isLastMsgFile, setIsLastMsgFile] = useState(false);
  const [isLastMsgGif, setIsLastMsgGif] = useState(false);
  const [chatTitle, setChatTitle] = useState('');
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
        const userLastReadMessage = updatedChatData.participantsReadMsg[loggedUser.userData?.handle];
        setAreMessagesRead(userLastReadMessage === updatedChatData.lastMessage);
      }
      if (updatedChatData?.title) {
        setChatTitle(updatedChatData.title);
      } else {
        setChatTitle(Object.keys(updatedChatData.participants).find(user => user !== loggedUser.userData?.handle))
      }
    });

    return () => {
      chatListener();
    };
  }, [chatId, loggedUser.userData?.handle, lastMessage]);

  return (
    <div id='chatBox-wrapper' onClick={() => navigate(`${chatId}`)} className="w-full relative flex items-center space-x-3 p-3 hover:bg-lightBlue rounded-lg transition cursor-pointer dark:text-darkText dark:hover:bg-darkAccent">
      {chatData?.isGroup === true ? (
        <GroupChatAvatar />
      ) : (
        <>
          <Avatar user={chatTitle} />
          <StatusBubble view={'ChatBox'} userHandle={chatTitle} />
        </>
      )}
      <div id='chatBox-content' className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium">
              {chatTitle}
            </p>
          </div>
          <div className="flex justify-between items-center mb-1">
              <p className="text-xs font-medium text-black dark:text-darkText"> 
                {isLastMsgGif ? 'GIF' : (isLastMsgFile ? 'File Sent' : (lastMessage.length > 25 ? lastMessage.slice(0, 25) + ' ...' : lastMessage))}
              </p>
          </div>
        </div>
      </div>
      <div id='chatBox-notification'>{areMessagesRead === true ? (
        <div className='flex w-2 h-2 rounded-full bg-transparent'></div>
      ) : (
        <div className='pb-9'>
          <div className='w-2 h-2 rounded-full bg-blue'></div>
        </div>
      )}
      </div>
    </div>
  )
}

ChatBox.propTypes = {
  chatId: PropTypes.string,
}
