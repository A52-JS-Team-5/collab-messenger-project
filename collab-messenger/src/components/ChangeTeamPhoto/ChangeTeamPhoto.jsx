import { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import PropTypes from 'prop-types';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { editTeam } from '../../services/teams.services';
import { DEFAULT_TEAM_PHOTO } from '../../common/constants';

export default function ChangeTeamPhoto({ teamDetails }) {
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [photoURL, setPhotoURL] = useState(DEFAULT_TEAM_PHOTO)
    const allowedTypes = ['image/jpeg', 'image/png'];
    const storage = getStorage();
    const [fileErrorMsg, setFileErrorMsg] = useState('');

    useEffect(() => {
        if (teamDetails.photoURL) {
            setPhotoURL(teamDetails.photoURL);
        }
    }, [teamDetails])

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
        const storageRef = ref(storage, `team_photos/${teamDetails.id}/${selectedPhoto.name}`);
        uploadBytes(storageRef, selectedPhoto)
            .then(() => {
                // Get the download URL of the uploaded photo
                return getDownloadURL(storageRef);
            })
            .then((downloadURL) => {
                // Now that we have the downloadURL, we can update the Realtime Database
                return editTeam(teamDetails.id, { photoURL: downloadURL });
            })
            .then(result => {
                if (result === 'Successful update') {
                    setIsUpdating(false);
                    // Photo updated successfully
                    toast('Team photo updated successfully.');
                }
            })
            .catch((error) => {
                setIsUpdating(false);
                console.log(error.message);
                toast('An error occurred while trying to update the team photo. Please try again.');
            });
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className='flex flex-col items-start gap-4'>
                <div className='flex flex-col items-start'>
                    <h3 className='font-bold text-lg text-left'>Update Team Picture</h3>
                    <p className="text-left">A picture helps people recognize the team.</p>
                </div>
                <div className="flex flex-row gap-4 max-md:flex-col items-center w-full">
                    <div className='flex flex-col self-stretch w-24 justify-top'>
                        <img src={photoURL} alt="Team Photo" className="object-cover rounded-md" />
                    </div>
                    <div className="flex flex-col justify-center w-full">
                        <label className="label self-stretch">
                            <span className="label-text">Pick a Team Picture</span>
                        </label>
                        <input type="file" className="file-input file-input-bordered w-full flex-start self-stretch bg-white file:bg-pink file:border-pink file:text-pureWhite" accept="image/*" id="fileInput" onChange={handlePhotoChange} />
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

ChangeTeamPhoto.propTypes = {
    teamDetails: PropTypes.object,
}
