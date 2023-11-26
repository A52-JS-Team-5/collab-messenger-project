import { useState, useContext } from "react";
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import AppContext from "../../context/AuthContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addMessage, createFileUploadMessage } from '../../services/messages.services';
import { updateChatFiles } from "../../services/chats.services";

export default function UploadFile({ message, setMessageFunc }) {
  const [selectedFile, setSelectedFile] = useState('');
  const loggedUser = useContext(AppContext);
  const storage = getStorage();
  const { chatId } = useParams();

  const handleFileUpload = () => {
    if (selectedFile === '') {
      return;
    }

    const storageRef = ref(storage, `chat_uploads/${chatId}/${selectedFile.name}`);
    uploadBytes(storageRef, selectedFile)
      .then(() => {
        return getDownloadURL(storageRef);
      })
      .then((downloadURL) => {
        createFileUploadMessage(downloadURL, loggedUser.userData.handle, chatId, selectedFile.name, selectedFile.type)
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
      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 bg-mint">
        <li><a><input type="file" className='text-black' accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf" onChange={(event) => {setSelectedFile(event.target.files[0])}}/></a></li>
        <li><a><input type="submit" placeholder='Submit' onClick={handleFileUpload} className='hover:cursor-pointer text-black'/></a></li>
      </ul>
    </div>
  )
}

UploadFile.propTypes = {
  message: PropTypes.object,
  setMessageFunc: PropTypes.func
}
