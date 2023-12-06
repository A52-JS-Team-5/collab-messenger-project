import PropTypes from "prop-types";
import { onValue, ref } from "firebase/database";
import Avatar from "../Avatar/Avatar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { updateChannelTitle } from "../../services/channels.services";
import { db } from '../../config/firebase-config';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getChannelById } from "../../services/channels.services";
import { getUploadedFilesInChannel } from "../../common/helpers";
import LeaveChannelModal from "../LeaveChannelModal/LeaveChannelModal";
import AddChannelMembers from "../AddChannelMembers/AddChannelMembers";
import UserProfile from "../../views/UserProfile/UserProfile";

export default function ChannelInformation() {
  const { channelId } = useParams();
  const [form, setForm] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [channelData, setChannelData] = useState({
    title: '',
    messages: {},
    participants: {},
    team: ''
  });
  const channelTitle = channelData.title;
  const channelParticipants = Object.keys(channelData?.participants);
  const [showTitle, setShowTitle] = useState(true);

  useEffect(() => {
    getChannelById(channelId)
      .then((data) => {
        setChannelData(data);
      })
      .catch((e) => {
        toast('Error in getting channel data. Please try again.')
        console.log(e.message);
      });

    const channelRef = ref(db, `channels/${channelId}`);
    const channelListener = onValue(channelRef, (snapshot) => {
      const updatedChannelData = snapshot.val();
      if (updatedChannelData) {
        setChannelData(updatedChannelData);
      }
    });

    return () => {
      channelListener();
    };
  }, [channelId]);

  useEffect(() => {
    getUploadedFilesInChannel(channelId)
      .then((urls) => setUploadedFiles(urls))
      .catch(e => console.log(e.message));

  }, [channelId]);

  const handleOpenEditField = () => {
    setShowTitle(!showTitle);
    setForm(channelTitle);
  };

  const onInputChange = (e) => {
    setForm(e.target.value);
  };

  const setNewContent = () => {
    updateChannelTitle(channelId, form);
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
    <div id="channel-information-wrapper" className="m-5 ">
      <div className="flex flex-row justify-center">
        {channelTitle === "General" ? (<div className="m-3 font-bold">{channelTitle}</div>) : (showTitle && <div className="m-3 font-bold">{channelTitle}</div>)}
        {channelTitle !== "General" && (
          <div>
            {showTitle && <div className="flex self-center text-xs opacity-50 hover:cursor-pointer mt-4" onClick={handleOpenEditField}><i className="fa-solid fa-pen-to-square"></i></div>}
            {!showTitle && (
              <div>
                <input type="text" value={`${form}`} onChange={onInputChange} onKeyDown={handleKeyDown} className="input input-bordered bg-white border-3 input-md m-3" />
                <button className="btn btn-ghost btn-xs flex self-center text-black hover:bg-lightBlue mb-3 ml-[11vh]" onClick={setNewContent}>Save</button>
              </div>
            )}
          </div>
        )}
      </div>
      <div id="channel-options">
        {channelTitle !== "General" && (
          <div className="flex flex-row gap-5 justify-center">
            <AddChannelMembers channelId={channelId} channelParticipants={channelParticipants} teamId={channelData.team} />
            <LeaveChannelModal channelId={channelId} />
          </div>
        )}
        <div className="collapse collapse-arrow bg-grey mt-4 text-left dark:bg-darkAccent">
          <input type="checkbox" />
          <div className="collapse-title text-sm font-medium ">
            <i className="fa-solid fa-user-group text-pink mr-2"></i>
            Participants
          </div>
          <div className="collapse-content text-sm">
            {channelParticipants.map(user => (
              <div key={user} >
                <div className="flex flex-row gap-2 p-2 rounded-md items-center hover:bg-pureWhite cursor-pointer" onClick={() => handleOpenUserProfileModal(user)}>
                  <Avatar user={user} />
                  <p>{user}</p>
                </div>
                {openUserProfileModal === user && <UserProfile userHandle={user} isOpen={true} onClose={handleCloseUserProfileModal} />}
              </div>)
            )}
          </div>
        </div>
        <div className="collapse collapse-arrow bg-grey mt-2 text-left dark:bg-darkAccent">
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

ChannelInformation.propTypes = {
  channelTitle: PropTypes.string,
  channelId: PropTypes.string,
  channelData: PropTypes.object
};
