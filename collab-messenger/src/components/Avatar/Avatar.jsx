import { useEffect, useState, useContext } from 'react';
import { getUserByHandle } from '../../services/users.services';
import PropTypes from 'prop-types';
import AppContext from '../../context/AuthContext';
import { DEFAULT_USER_PHOTO } from '../../common/constants';

export default function Avatar({ user, chatComponent='' }) {
  const [userAvatar, setUserAvatar] = useState(DEFAULT_USER_PHOTO);
  const loggedUser = useContext(AppContext);
  const loggedUserHandle = loggedUser.userData?.handle;
  const loggedUserAvatar = loggedUser?.userData?.photoURL;

  useEffect(() => {
    if (loggedUserHandle !== user) {
      getUserByHandle(user)
        .then((userData) => {
          if(userData.photoURL){
            setUserAvatar(userData.photoURL);
          }
        })
        .catch((error) => {
          console.error('Error fetching avatar: ', error);
        })
    } else {
      if (loggedUserAvatar) {
        setUserAvatar(loggedUserAvatar);
      }
    }
  }, [user, loggedUserHandle, loggedUserAvatar]);

  return (
    <div className={`chat-image static avatar ${chatComponent ? 'w-23 h-23' : 'w-10 h-10'}`}>
      <div className="rounded-full">
        <img src={userAvatar} />
      </div>
    </div>
  )
}

Avatar.propTypes = {
  user: PropTypes.string,
  chatComponent: PropTypes.bool
}
