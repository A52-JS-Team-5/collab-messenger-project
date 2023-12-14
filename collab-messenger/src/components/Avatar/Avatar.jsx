import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { DEFAULT_USER_PHOTO } from '../../common/constants';
import { onValue, ref } from 'firebase/database';
import { db } from '../../config/firebase-config';

export default function Avatar({ user, chatComponent = '' }) {
  const [userAvatar, setUserAvatar] = useState(DEFAULT_USER_PHOTO);

  useEffect(() => {
    if (user) {
      const userRef = ref(db, `users/${user}/photoURL`);

      const userListener = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          setUserAvatar(snapshot.val());
        } else {
          setUserAvatar(DEFAULT_USER_PHOTO);
        }
      })

      return () => {
        userListener();
      };
    }
  }, [user]);

  return (
    <div className={`chat-image static avatar ${chatComponent === 'ChatInformation' ? 'w-24 h-24' : (chatComponent === 'ChangeProfilePicture' ? 'w-24 h-24' : 'w-10 h-10')}`}>
      <div className="rounded-full">
        <img src={userAvatar} />
      </div>
    </div>
  )
}

Avatar.propTypes = {
  user: PropTypes.string,
  chatComponent: PropTypes.string
}
