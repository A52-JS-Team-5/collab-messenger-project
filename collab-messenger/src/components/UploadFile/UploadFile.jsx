import { useContext } from "react";
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import AppContext from "../../context/AuthContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addMessage, createFileUploadMessage } from '../../services/messages.services';
import { updateChatFiles } from "../../services/chats.services";

export default function UploadFile({ message, setMessageFunc }) {
  const loggedUser = useContext(AppContext);
  const storage = getStorage();
  const { chatId } = useParams();

  const handleFileUpload = (file) => {

    const storageRef = ref(storage, `chat_uploads/${chatId}/${file.name}`);
    uploadBytes(storageRef, file)
      .then(() => {
        return getDownloadURL(storageRef);
      })
      .then((downloadURL) => {
        createFileUploadMessage(downloadURL, loggedUser.userData.handle, chatId, file.name, file.type)
          .then((messageId) => {
            return addMessage(loggedUser.userData.handle, chatId, messageId, downloadURL)
          })
          .catch((error) => {
            toast('Cannot create message. Please try again.')
            console.log('Error in creating message', error.message);
        })

        return downloadURL;
      })
      .then((downloadURL) => {
        updateChatFiles(chatId, downloadURL);
        setMessageFunc({
          ...message,
          ['content']: downloadURL,
        });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div className="dropdown dropdown-right dropdown-end ">
      <label tabIndex={0} className="btn hover:cursor-pointer hover:bg-mint btn btn-sm text-black bg-transparent flex items-center w-fit"><i className="fa-solid fa-paperclip"></i></label>
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 bg-light-gray">
        <li><a><input type="file" className='text-black' accept=".jpeg,.jpg,.gif,.pdf" onChange={(event) => {handleFileUpload(event.target.files[0]);}}/></a></li>
      </ul>
    </div>
  )
}

UploadFile.propTypes = {
  message: PropTypes.object,
  setMessageFunc: PropTypes.func
}
