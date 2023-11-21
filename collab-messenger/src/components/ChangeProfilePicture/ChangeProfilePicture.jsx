import { getAuth, updateProfile } from "firebase/auth";
import './ChangeProfilePicture.css';
import { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { editUserProfile } from "../../services/users.services";
import PropTypes from 'prop-types';

export default function ChangeProfilePicture({ handle }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [photoURL, setPhotoURL] = useState('https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg')
  const [isSuccessful, setIsSuccessful] = useState(false);
  const allowedTypes = ['image/jpeg', 'image/png'];

  const auth = getAuth();
  const storage = getStorage();

  useEffect(() => {
    if (auth?.currentUser.photoURL) {
      setPhotoURL(auth.currentUser.photoURL);
    }
  }, [auth])

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please upload a JPEG, PNG, or PDF file.');
      document.getElementById('fileInput').value = '';
    }

    setSelectedPhoto(file);
  };

  const handleUpdatePhoto = () => {
    if (!selectedPhoto) {
      return; // No file selected
    }

    setIsUpdating(true);
    setUpdateError(null);

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
        setIsSuccessful(true);
        // Profile photo updated successfully

        // Now that we have the downloadURL, we can update the Realtime Database
        return editUserProfile(handle, { photoURL: downloadURL });
      })
      .catch((error) => {
        setIsUpdating(false);
        setUpdateError(error.message);
      });
  };

  return (
    <div className="update-picture flex flex-col gap-4">
      <div className='picture-details'>
        <div className='picture-intro'>
          <h2>Update Profile Picture</h2>
          <p>A picture helps people recognize you and lets you know when you are signed in to your account.</p>
        </div>
        <div className="picture-form-control flex flex-row gap-4 max-md:flex-col">
          <img src={photoURL} alt="Avatar" className="avatar" />
          <div className="flex flex-col justify-center">
            <label className="label self-stretch">
              <span className="label-text">Pick a Profile Picture</span>
            </label>
            <input type="file" className="file-input file-input-bordered w-full flex-start self-stretch bg-light-gray" accept="image/*" id="fileInput" onChange={handlePhotoChange} />
              {selectedPhoto && selectedPhoto !== '' && (<button className="btn btn-active btn-secondary" onClick={handleUpdatePhoto}>{isUpdating ? "Updating..." : "Update Photo"}</button>)}
          </div>
        </div>
      </div>
      {updateError && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{updateError}</span>
        </div>
      )}
      {isSuccessful && (
        <div className="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Profile Picture Updated Successfully.</span>
        </div>
      )}
    </div>
  );
}

ChangeProfilePicture.propTypes = {
  handle: PropTypes.string,
}
