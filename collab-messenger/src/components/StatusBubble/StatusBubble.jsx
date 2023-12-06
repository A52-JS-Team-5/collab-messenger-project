import { useEffect, useState } from "react";
import { getUserByHandle } from "../../services/users.services";
import PropTypes from 'prop-types';
import { db } from '../../config/firebase-config';
import { ref, onValue } from 'firebase/database';

export default function StatusBubble({ view, userHandle }) {
  const [userCurrentStatus, setUserCurrentStatus] = useState('Online');
  const statusColors = {
    'Online': 'bg-green',
    'Offline': 'bg-black',
    'Away': 'bg-yellow'
  };

  const positionOfStatus = {
    'ChatDetails': 'left-14 top-10',
    'ChatDetails-Mobile': 'left-[86px] top-9',
    'ChatBox': 'left-8 top-10'
  }

  useEffect(() => {
    getUserByHandle(userHandle)
      .then((userData) => {
        if(userData?.status) {
          setUserCurrentStatus(userData?.status);
        }
      })
      .catch((error) => {
        console.error('Error fetching user status: ', error);
      })

    const userRef = ref(db, `users/${userHandle}/status`);
    const userStatusListener = onValue(userRef, (snapshot) => {
      const updatedStatus = snapshot.val();
      setUserCurrentStatus(updatedStatus);
    });
  
    return () => {
      userStatusListener();
    };

  }, [userHandle]);

  return <div className={`absolute w-2 h-2 rounded-full ${positionOfStatus[view]} ${statusColors[userCurrentStatus]}`}></div>
}

StatusBubble.propTypes = {
  view: PropTypes.string,
  userHandle: PropTypes.string
}
