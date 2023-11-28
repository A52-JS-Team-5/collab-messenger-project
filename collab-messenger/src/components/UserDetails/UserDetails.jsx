import PropTypes from 'prop-types';
import './UserDetails.css';
import { changeStatus } from '../../services/users.services';
import { useState, useEffect } from 'react';
import { db } from '../../config/firebase-config';
import { ref, onValue } from 'firebase/database';

export default function UserDetails({ user }) {
  const [currentStatus, setCurrentStatus] = useState(user?.status);
  const timestamp = new Date(user.createdOn).toLocaleDateString();
  const defaultPhotoURL = 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg';
  const statusColors = {
    'Online': 'bg-green',
    'Offline': 'bg-black',
    'Away': 'bg-yellow'
  };

  const handleStatusChange = (event) => {
    const selection = event.target.value;
    if(user?.status !== selection) {
      changeStatus(user?.handle, selection);
      setCurrentStatus(selection);
    }
  }

  useEffect(() => {
    const userRef = ref(db, `users/${user?.handle}/status`);
    const userStatusListener = onValue(userRef, (snapshot) => {
      const updatedStatus = snapshot.val();
      setCurrentStatus(updatedStatus);
    });

    return () => {
      userStatusListener();
    };
  }, [user?.handle, currentStatus])

  return (
    <div className='user-card md:max-xl:flex-row'>
      <div className='static'>
      <img src={user?.photoURL || defaultPhotoURL} alt="Avatar" className="avatar-details z-0" />
        <div className={`absolute left-[405px] top-60 w-4 h-4 rounded-full ${statusColors[currentStatus]} z-40`}></div>
      </div>
      <div className='user-card-details'>
        <div className='user-info'>
          <h3>{user.name} {user.surname}</h3>
          <p>@{user.handle}</p>
        </div>
        <div className='flex gap-1'>
          <p className='self-center'>Status:</p>
          <select placeholder={currentStatus} onChange={handleStatusChange} className="select w-full max-w-xs bg-transparent">
            <option>Online</option>
            <option>Away</option>
            <option>Offline</option>
          </select>
        </div>
        {user.bio && <p>{user.bio}</p>}
        <p>Date of Joining: {timestamp}</p>
      </div>
    </div>
  );
}

UserDetails.propTypes = {
  user: PropTypes.object,
};
