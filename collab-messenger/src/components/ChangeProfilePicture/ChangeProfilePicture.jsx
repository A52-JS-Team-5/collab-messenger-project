import { getAuth, updateProfile } from "firebase/auth";
import { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { editUserProfile } from "../../services/users.services";
import PropTypes from 'prop-types';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function ChangeProfilePicture({ handle }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const allowedTypes = ['image/jpeg', 'image/png'];
  const [fileErrorMsg, setFileErrorMsg] = useState('');
  const auth = getAuth();
  const storage = getStorage();
  const [photoURL, setPhotoURL] = useState('https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg');

  useEffect(() => {
    if (auth?.currentUser.photoURL) {
      setPhotoURL(auth.currentUser.photoURL);
    }
  }, [auth?.currentUser.photoURL])

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!allowedTypes.includes(file.type) && file) {
      setFileErrorMsg('Invalid file type. Please upload a JPEG, JPG or PNG file.');
      document.getElementById('fileInput').value = null;
    } else {
      setFileErrorMsg('');
    }

    setSelectedPhoto(file);
  };

  const handleUpdatePhoto = () => {
    if (!selectedPhoto) {
      setFileErrorMsg('Please select a JPEG, JPG or PNG file.');
      return; // No file selected
    }

    setIsUpdating(true);

    // Upload the selected photo to Firebase Storage
    const storageRef = ref(storage, `profile_photos/${auth.currentUser.uid}/${selectedPhoto.name}`);
    uploadBytes(storageRef, selectedPhoto)
      .then(() => {
        // Get the download URL of the uploaded photo
        return getDownloadURL(storageRef);
      })
      .then((downloadURL) => {
        // Update the user's profile with the new photo URL
        updateProfile(auth.currentUser, { photoURL: downloadURL });
        return downloadURL;
      })
      .then((downloadURL) => {
        setIsUpdating(false);

        // Now that we have the downloadURL, we can update the Realtime Database
        return editUserProfile(handle, { photoURL: downloadURL });
      })
      .then(result => {
        if (result === 'Successful update') {
          setIsUpdating(false);
          // Photo updated successfully
          toast('Profile picture updated successfully.');
        }
      })
      .catch((error) => {
        setIsUpdating(false);
        console.log(error.message);
        toast('An error occurred while trying to update the team photo. Please try again.');
      });
  };

  return (
    <div className="flex flex-col gap-4 basis-4/5 rounded-md bg-pureWhite p-4 h-full dark:bg-darkFront dark:text-darkText">
      <div className='flex flex-col gap-4 rounded-md border-lightBlue border-2 p-8 w-full dark:border-darkAccent'>
        <div className='flex flex-col items-start'>
          <h3 className='font-bold text-lg text-left'>Update Profile Photo</h3>
          <p className="text-left">A picture helps people recognize you and lets you know when you are signed in to your account.</p>
        </div>
        <div className="flex flex-row gap-4 max-md:flex-col items-center w-full">
          <div className='flex flex-col self-stretch w-24 h-24 aspect-square justify-top'>
            <img src={photoURL} alt="Profile Photo" className="object-cover rounded-md" />
          </div>
          <div className="flex flex-col justify-center w-full">
            <label className="label self-stretch">
              <span className="label-text">Pick a Profile Photo</span>
            </label>
            <input type="file" className="file-input file-input-bordered w-full border-none flex-start self-stretch bg-white dark:bg-darkAccent file:bg-pink file:border-pink file:text-pureWhite" accept="image/*" id="fileInput" onChange={handlePhotoChange} />
            {fileErrorMsg && <span className="err-message text-red">{fileErrorMsg}</span>}
          </div>
          <div className='flex flex-col self-stretch justify-end'>
            {selectedPhoto && !fileErrorMsg && (<button className="btn border-none bg-pink text-pureWhite w-32" onClick={handleUpdatePhoto}>{isUpdating ? "Updating..." : "Update Photo"}</button>)}
          </div>
        </div>
      </div>
    </div>
  );
}

ChangeProfilePicture.propTypes = {
  handle: PropTypes.string,
}
