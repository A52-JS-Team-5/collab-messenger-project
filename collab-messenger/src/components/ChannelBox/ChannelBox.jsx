import { useNavigate } from "react-router-dom";
import AppContext from "../../context/AuthContext";
import { useEffect, useState, useContext } from "react";
import { getChannelById } from "../../services/channels.services";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { db } from "../../config/firebase-config";
import { ref, onValue } from "firebase/database";
import PropTypes from 'prop-types';

export default function ChannelBox({ channelId, onClick }) {
  const navigate = useNavigate();
  const loggedUser = useContext(AppContext);
  const [lastMessage, setLastMessage] = useState('');
  const [isLastMsgFile, setIsLastMsgFile] = useState(false);
  const [isLastMsgGif, setIsLastMsgGif] = useState(false);
  const [channelTitle, setChannelTitle] = useState('');
  const [areMessagesRead, setAreMessagesRead] = useState(true);

  useEffect(() => {
    getChannelById(channelId)
      .then((data) => {
        setChannelTitle(data.title);

        setLastMessage(data.lastMessage);
        setIsLastMsgGif(data.lastMessage.includes('giphy'));
        setIsLastMsgFile(data.lastMessage.includes('channel_uploads'));
      })
      .catch((e) => {
        toast(`Error in getting channel data. Please try again.`);
        console.log(e.message);
      })

    const channelRef = ref(db, `channels/${channelId}`);
    const channelListener = onValue(channelRef, (snapshot) => {
      const updatedChannelData = snapshot.val();
      if (updatedChannelData?.lastMessage) {
        setLastMessage(updatedChannelData.lastMessage);
      }
      if (updatedChannelData?.participantsReadMsg) {
        const userLastReadMessage = updatedChannelData.participantsReadMsg[loggedUser.userData.handle];
        setAreMessagesRead(userLastReadMessage === updatedChannelData.lastMessage);
      }
    });

    return () => {
      channelListener();
    }
  }, [channelId, loggedUser.userData?.handle, lastMessage]);

  const handleClick = () => {
    onClick();
    navigate(`${channelId}`);
  };

  return (
    <div onClick={handleClick} className="w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-lightBlue rounded-lg transition cursor-pointer pb-2 dark:text-darkText dark:hover:bg-darkAccent dark:bg-darkFront">
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium">
              {channelTitle}
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

ChannelBox.propTypes = {
  channelId: PropTypes.string,
  onClick: PropTypes.func
}