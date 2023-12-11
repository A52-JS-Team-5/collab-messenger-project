import { useEffect, useState } from "react";
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
    'ChatDetails': 'left-[32px] bottom-[4px]',
    'ChatDetails-Mobile': 'left-[32px] bottom-[4px]',
    'ChatBox': 'left-8 top-10',
    'AppNav': 'top-8 right-1'
  }

  useEffect(() => {
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
