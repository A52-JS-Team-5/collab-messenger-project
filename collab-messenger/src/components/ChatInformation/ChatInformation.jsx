import PropTypes from "prop-types";
import Avatar from "../Avatar/Avatar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { onValue, ref } from "firebase/database";
import { db } from '../../config/firebase-config';
import LeaveChatModal from "../LeaveChatModal/LeaveChatModal";
import { updateGroupChatTitle } from "../../services/chats.services";
import GroupChatAvatar from "../GroupChatAvatar/GroupChatAvatar";
import AddGroupChatMembers from "../AddGroupChatMembers/AddGroupChatMembers";
import UserProfile from "../../views/UserProfile/UserProfile";
import { getUploadedFilesInChat } from '../../common/helpers';

export default function ChatInformation({ isGroupChat }) {
  const { chatId } = useParams();
  const [form, setForm] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [chatData, setChatData] = useState({
    title: '',
    participants: {}
  });
  const [showTitle, setShowTitle] = useState(true);

  useEffect(() => {
    const chatRef = ref(db, `chats/${chatId}`);
    const chatListener = onValue(chatRef, (snapshot) => {
      const updatedChannelData = snapshot.val();
      if (updatedChannelData) {
        setChatData(updatedChannelData);
      }
      getUploadedFilesInChat(chatId)
        .then((urls) => setUploadedFiles(urls))
        .catch(e => console.log(e.message));
    });
  
    return () => {
      chatListener();
    };
  }, [chatId]);

  const handleOpenEditField = () => {
    setShowTitle(!showTitle);
    setForm(chatData.title);
  };

  const onInputChange = (e) => {
    setForm(e.target.value);
  };

  const setNewContent = () => {
    updateGroupChatTitle(chatId, form);
    setShowTitle(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowTitle(true);
    }

    if (e.key === 'Enter') {
      setNewContent();
    }
  };

  // State for the currently opened user profile modal
  const [openUserProfileModal, setOpenUserProfileModal] = useState('');

  // Function to open user profile modal for a specific user
  const handleOpenUserProfileModal = (userHandle) => {
    setOpenUserProfileModal(userHandle);
  };

  // Function to close user profile modal
  const handleCloseUserProfileModal = () => {
    setOpenUserProfileModal(false);
  };

  return (
    <div id="chat-information-wrapper" className="m-5">
      {isGroupChat ? <GroupChatAvatar chatComponent={'ChatInformation'} /> : <Avatar user={chatData.title} chatComponent={'ChatInformation'} />}
      <div className="flex flex-row justify-center">
        {!isGroupChat ? (<button className="btn btn-active btn-link" onClick={() => handleOpenUserProfileModal(chatData.title)}>{chatData.title}</button>) : (showTitle && <div className="m-3 font-bold">{chatData.title}</div>)}
        {openUserProfileModal === chatData.title && <UserProfile userHandle={chatData.title} isOpen={true} onClose={handleCloseUserProfileModal} />}
        {isGroupChat && (
          <div>
            {showTitle && <div className="flex self-center text-xs opacity-50 hover:cursor-pointer mt-4" onClick={handleOpenEditField}><i className="fa-solid fa-pen-to-square"></i></div>}
            {!showTitle && <div>
              <input type="text" value={`${form}`} onChange={onInputChange} onKeyDown={handleKeyDown} className="input input-bordered bg-pureWhite border-3 dark:text-pureWhite dark:bg-darkInput input-md m-3" />
              <button className="btn btn-ghost btn-xs flex self-center text-black hover:bg-lightBlue mb-3 ml-[11vh] dark:text-pureWhite dark:bg-darkInput" onClick={setNewContent}>Save</button>
            </div>}
          </div>
        )}
      </div>
      <div id="group-chat-options">
        {isGroupChat && (
          <div>
            <div className="flex flex-row gap-5 justify-center">
              <AddGroupChatMembers chatId={chatId} chatParticipants={Object.keys(chatData.participants)} />
              <LeaveChatModal chatId={chatId} />
            </div>
            <div className="collapse collapse-arrow bg-white dark:bg-darkAccent mt-4 text-left">
              <input type="checkbox" />
              <div className="collapse-title text-sm font-medium ">
                <i className="fa-solid fa-user-group text-pink mr-2"></i>
                Participants
              </div>
              <div className="collapse-content text-sm">
                {Object.keys(chatData.participants).map(user => (
                  <div key={user} >
                    <div className="flex flex-row gap-2 p-2 rounded-md items-center cursor-pointer hover:bg-pureWhite dark:hover:bg-darkFront" onClick={() => handleOpenUserProfileModal(user)}>
                      <Avatar user={user} />
                      <p>{user}</p>
                    </div>
                    {openUserProfileModal === user && <UserProfile userHandle={user} isOpen={true} onClose={handleCloseUserProfileModal} />}
                  </div>)
                )}
              </div>
            </div>
          </div>
        )}
        <div className="collapse collapse-arrow bg-white dark:bg-darkAccent mt-2 text-left">
          <input type="checkbox" />
          <div className="collapse-title text-sm font-medium">
            <i className="fa-solid fa-box-archive text-pink mr-2"></i>
            Shared Files
          </div>
          <div className="collapse-content text-sm">
            {uploadedFiles.length > 0 && (
              uploadedFiles.map(file => (
                <div key={file.url} className="flex flex-row gap-2 p-2 rounded-md items-center cursor-pointer hover:bg-pureWhite">
                  <i className="fa-regular fa-file text-blue mr-2"></i>
                  <a target="_blank" rel="noreferrer" download href={file.url}>{file.fileName.length > 15 ? file.fileName.slice(0, 15) + '...' : file.fileName}</a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

ChatInformation.propTypes = {
  isGroupChat: PropTypes.bool,
};
