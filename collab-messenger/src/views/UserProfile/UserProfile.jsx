import { useEffect, useState } from 'react';
import { getUserByHandle } from '../../services/users.services';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from '../../config/firebase-config';
import { onValue, ref } from 'firebase/database';
import cn from 'classnames';
import PropTypes from 'prop-types';

const UserProfile = ({ userHandle, isOpen, onClose }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserByHandle(userHandle)
      .then((userData) => {
        setUserDetails(userData);
        setLoading(false);
      })
      .catch((error) => {
        toast('Cannot load user profile. Please try again later.');
        console.error('Error fetching user data: ', error);
        setLoading(false);
      });

    const userRef = ref(db, `users/${userHandle}`);
    const userListener = onValue(userRef, (snapshot) => {
      const updatedUserData = snapshot.val();
      if (updatedUserData) {
        setUserDetails(updatedUserData);
      }
    })

    return () => {
      userListener();
    };

  }, [userHandle]);

  const timestamp = new Date(userDetails?.createdOn).toLocaleDateString();
  const defaultPhotoURL = 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg';
  const statusColors = {
    'Online': 'bg-green',
    'Offline': 'bg-black',
    'Away': 'bg-yellow'
  };

  const modalClass = cn({
    "modal modal-bottom sm:modal-middle": true,
    "modal-open": isOpen,
  });

  return (
    !loading && userDetails &&
    <div className="user-profile-wrapper dark:text-darkText">
      <div id='user-profile-modal' className={`${modalClass}`}>
        <div className="modal-box bg-gradient-to-b from-pureWhite from-20% to-lightBlue to-20% dark:bg-gradient-to-b dark:from-darkBase dark:from-20% dark:to-darkFront dark:to-20% min-[320px]:max-w-2xl max-[4800px]:max-w-2xl">
          <button className="btn btn-sm btn-circle hover:bg-lightBlue border-none text-blue bg-pureWhite absolute right-2 top-2 dark:bg-darkAccent" onClick={onClose}>✕</button>
          <div className='flex flex-col gap-10'>
            <div className='flex flex-col'>
              <div className='flex flex-col gap-6'>
                <div className="avatar">
                  {userDetails?.status && <div className={`absolute left-[70px] bottom-0 w-4 h-4 rounded-full ${statusColors[userDetails?.status]} border-2 border-white z-40 dark:border-darkAccent`}></div>}
                  <div className="w-24 rounded-full aspect-square bg-pureWhite">
                    <img src={userDetails?.photoURL || defaultPhotoURL} alt="Avatar" className="w-24 h-24 rounded-full aspect-square border-4 border-pureWhite" />
                  </div>
                </div>
                <div className='flex flex-col w-full rounded-md bg-pureWhite p-6 dark:bg-darkAccent'>
                  <div className='flex flex-col w-full'>
                    <h2 className='text-xl font-bold text-left'>{userDetails.name} {userDetails.surname}</h2>
                    <p className='text-left'>@{userDetails.handle}</p>
                  </div>
                  <div className="divider w-full"></div>
                  {userDetails?.bio &&
                    <div className='flex flex-col'>
                      <p className='text-left text-blue text-sm dark:text-yellow'>Bio</p>
                      <p className='text-left'>{userDetails.bio}</p>
                      <div className="divider"></div>
                    </div>}
                  <div className='flex flex-row justify-between w-full max-md:flex-col gap-2'>
                    <div className='flex flex-col'>
                      <p className='text-left text-blue text-sm dark:text-yellow'>Email</p>
                      <p className='text-left'>{userDetails.email}</p>
                    </div>
                    <div className='flex flex-col'>
                      <p className='text-left text-blue text-sm dark:text-yellow'>Phone Number</p>
                      <p className='text-left'>{userDetails.phoneNumber}</p>
                    </div>
                    <div className='flex flex-col'>
                      <p className='text-left text-blue text-sm dark:text-yellow'>Member since</p>
                      <p className='text-left'>{timestamp}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

UserProfile.propTypes = {
  userHandle: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

export default UserProfile;
