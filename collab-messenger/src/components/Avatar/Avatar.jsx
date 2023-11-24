import { useEffect, useState, useContext } from 'react';
import { getUserByHandle } from '../../services/users.services';
import PropTypes from 'prop-types';
import AppContext from '../../context/AuthContext';

export default function Avatar({ user }) {
  const [userAvatar, setUserAvatar] = useState('https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg');
  const loggedUser = useContext(AppContext);

  useEffect(() => {
    if (loggedUser.userData?.handle !== user) {
      getUserByHandle(user)
        .then((userData) => {
          setUserAvatar(userData.val()?.photoURL);
        })
        .catch((error) => {
          console.error('Error fetching avatar: ', error);
        })
    } else {
      setUserAvatar(loggedUser?.userData?.photoURL)
    }
  }, [user, loggedUser?.userData?.handle, loggedUser?.userData?.photoURL]);

  return (
    <div className="chat-image avatar w-10 h-10">
      <div className="rounded-full">
        <img src={userAvatar} />
      </div>
    </div>
  )
}

Avatar.propTypes = {
  user: PropTypes.string
}
