import PropTypes from "prop-types";
import Avatar from "../Avatar/Avatar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LeaveChatModal from "../LeaveChatModal/LeaveChatModal";
import { updateGroupChatTitle } from "../../services/chats.services";
import { ref, list, getStorage, getDownloadURL } from "firebase/storage";
import GroupChatDefaultAvatar from '../../assets/GroupChatDefaultAvatar.png'
import AddGroupChatMembers from "../AddGroupChatMembers/AddGroupChatMembers";

export default function ChatInformation({ isGroupChat, chatTitle, chatId, chatData }) {
  const navigate = useNavigate();
  const [form, setForm] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const chatParticipants = Object.keys(chatData.participants);
  const [showTitle, setShowTitle] = useState(true);
  const [originalContent, setOriginalContent] = useState(chatTitle);

  useEffect(() => {
    const storage = getStorage();
    const storageRef = ref(storage, `chat_uploads/${chatId}`);

    list(storageRef, { maxResults: 10 })
      .then((result) => {
        const uploads = result.items;

        const downloadUrls = uploads.map(item => {
          return getDownloadURL(ref(storage, item._location.path_))
            .then((url) => ({
              fileName: item._location.path_.split('/').pop(),
              'url': url 
            }))
            .catch(e => console.log('Error getting download URL for file: ', e.message))
        })

        Promise.all(downloadUrls)
          .then((urls) => setUploadedFiles(urls))
          .catch(e => console.log(e.message));
      })
      .catch((e) => console.log(e.message));

  }, [chatId]);

  const handleOpenEditField = () => {
    setShowTitle(!showTitle);
    setForm(originalContent);
  };

  const onInputChange = (e) => {
    setForm(e.target.value);
  };

  const setNewContent = () => {
    updateGroupChatTitle(chatId, form);
    setOriginalContent(form);
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

  return (
    <div id="chat-information-wrapper" className="m-5 ">
      {isGroupChat ? GroupChatDefaultAvatar : <Avatar user={chatTitle} chatComponent={'ChatInformation'} />} 
      <div className="flex flex-row justify-center">
        {!isGroupChat ? (<div className="m-3 font-bold">{chatTitle}</div>) : (showTitle && <div className="m-3 font-bold">{chatTitle}</div>)}
        {isGroupChat && (
          <div>
            {showTitle && <div className="flex self-center text-xs opacity-50 hover:cursor-pointer" onClick={handleOpenEditField}><i className="fa-solid fa-pen-to-square"></i></div>}
            {!showTitle && <div className='flex space-between'>
              <input type="text" value={`${form}`} onChange={onInputChange} onKeyDown={handleKeyDown} className="input input-bordered bg-white border-3 input-md m-3" />
              <button className="btn btn-ghost btn-md flex self-center text-black hover:bg-lightBlue" onClick={setNewContent}>Save</button>
            </div>}
          </div>
        )}
      </div>
      <div id="group-chat-options">
        {isGroupChat && (
          <div>
            <div className="flex flex-row gap-5 justify-center">
              <AddGroupChatMembers chatId={chatId} chatParticipants={chatParticipants} />
              <LeaveChatModal chatId={chatId} />
            </div>
            <div className="collapse collapse-arrow bg-grey mt-4 text-left">
              <input type="checkbox" /> 
              <div className="collapse-title text-sm font-medium ">
                <i className="fa-solid fa-user-group text-pink mr-2"></i> 
                Participants
              </div>
              <div className="collapse-content text-sm"> 
                {chatParticipants.map(user => (
                  <div key={user} className="flex flex-row gap-2 p-2 rounded-md items-center cursor-pointer hover:bg-pureWhite" onClick={() => {navigate(`/app/users/${user})`)}}>
                    <Avatar user={user} />
                    <p>{user}</p>
                  </div>)
                )}
              </div>
            </div>
          </div>
        )}
        <div className="collapse collapse-arrow bg-grey mt-2 text-left">
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
                  <a target="_blank" rel="noreferrer" download href={file.url}>{file.fileName}</a>
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
  chatTitle: PropTypes.string,
  chatId: PropTypes.string,
  chatData: PropTypes.object
};
