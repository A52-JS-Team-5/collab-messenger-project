import { useContext } from "react";
import PropTypes from 'prop-types';
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import AppContext from "../../context/AuthContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addMessage, createFileUploadMessage, createFileUploadMessageForChannels, addMessageChannel } from '../../services/messages.services';
import { updateChatFiles } from "../../services/chats.services";
import { updateChannelFiles } from "../../services/channels.services";

export default function UploadFile({ message, setMessageFunc, component, id }) {
  const loggedUser = useContext(AppContext);
  const storage = getStorage();

  const handleFileUpload = (file) => {
    if(component === 'ChannelDetails') {
      const storageRef = ref(storage, `channel_uploads/${id}/${file.name}`);
      uploadBytes(storageRef, file)
        .then(() => {
          return getDownloadURL(storageRef);
        })
        .then((downloadURL) => {
          createFileUploadMessageForChannels(downloadURL, loggedUser.userData.handle, id, file.name, file.type)
            .then((messageId) => {
              return addMessageChannel(id, messageId, downloadURL, loggedUser.userData.handle)
            }) 
            .catch((error) => {
              toast('Cannot create message. Please try again.')
              console.log('Error in creating message', error.message);
          })
  
          return downloadURL;
        })
        .then((downloadURL) => {
          updateChannelFiles(id, downloadURL);
          setMessageFunc({
            ...message,
            ['content']: downloadURL,
          });
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else {
      const storageRef = ref(storage, `chat_uploads/${id}/${file.name}`);
      uploadBytes(storageRef, file)
        .then(() => {
          return getDownloadURL(storageRef);
        })
        .then((downloadURL) => {
          createFileUploadMessage(downloadURL, loggedUser.userData.handle, id, file.name, file.type)
            .then((messageId) => {
              return addMessage(loggedUser.userData.handle, id, messageId, downloadURL)
            })
            .catch((error) => {
              toast('Cannot create message. Please try again.')
              console.log('Error in creating message', error.message);
          })
  
          return downloadURL;
        })
        .then((downloadURL) => {
          updateChatFiles(id, downloadURL);
          setMessageFunc({
            ...message,
            ['content']: downloadURL,
          });
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
    
  };

  return (
    <div className="dropdown dropdown-right dropdown-end ">
      <button tabIndex={0} className="hover:cursor-pointer hover:bg-grey btn-xs text-black bg-transparent rounded-md flex items-center w-fit"><i className="fa-solid fa-paperclip text-blue"></i></button>
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 bg-light-gray">
        <li><a><input type="file" className='text-black' accept=".jpeg,.jpg,.gif,.pdf" onChange={(event) => {handleFileUpload(event.target.files[0]);}}/></a></li>
      </ul>
    </div>
  )
}

UploadFile.propTypes = {
  message: PropTypes.object,
  setMessageFunc: PropTypes.func,
  component: PropTypes.string,
  id: PropTypes.string
}
