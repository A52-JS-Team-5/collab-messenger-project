import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AuthContext';
import { addChat, createChat } from '../../services/chats.services';
import { db } from '../../config/firebase-config';
import { ref, onValue } from 'firebase/database';

export default function UsersList({ users }) {
  return (
    <div className="grid grid-cols-5 max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3 max-xl:grid-cols-4 gap-4 w-full">
      {users.map(user => <UserData user={user} key={user.id} />)}
    </div>
  )
}

function UserData({ user }) {
  const navigate = useNavigate();
  const loggedUser = useContext(AppContext);
  const [existingChatId, setExistingChatId] = useState('');

  useEffect(() => {
    const userRef = ref(db, `users/${loggedUser.userData?.handle}/chatParticipants`);
    const userChatsListener = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const existingChats = snapshot.val();
        setExistingChatId(existingChats[`${user?.handle}`]);
      }
    });

    return () => {
      userChatsListener();
    };
  }, [loggedUser.userData?.handle, user?.handle])

  const startChat = (event) => {
    event.preventDefault();
    if (existingChatId) {
      navigate(`/app/chats/${existingChatId}`)
    } else {
      createChat(user?.handle, loggedUser.userData?.handle)
        .then((chatId) => {
          navigate(`/app/chats/${chatId}`);
          return chatId;
        })
        .then((chatId) => {
          return addChat(user?.handle, loggedUser.userData?.handle, chatId);
        })
        .catch(e => {
          console.log('Error creating a new chat: ', e.message);
        })
    }

  }

  return (
    <div className='flex flex-col gap-4 rounded-md justify-left items-start bg-pureWhite dark:bg-darkFront p-4 dark:text-darkText self-stretch'>
      <div className='flex flex-row items-start gap-2'>
        <img className='w-12 h-12 object-cover rounded-full' src={user?.photoURL} alt={`${user?.name} ${user?.surname}`} />
        <div className='flex flex-col'>
          <div className="flex place-items-end text-lg font-semibold text-left">{`${user.name} ${user.surname}`}</div>
          <div className="flex place-items-end text-sm text-left">@{user.id}</div>
        </div>
      </div>
      <div className='h-14 flex flex-col w-full'>
        <div className='text-sm flex place-items-end'>Member since: {(user?.createdOn)}</div>
        <div className='flex place-self-end'>
          {loggedUser?.userData && user?.handle !== loggedUser.userData?.handle &&
            <button className="btn btn-square border-none btn-sm bg-pink text-pureWhite" onClick={startChat}><i className="fa-solid fa-comment"></i></button>
          }
        </div>
      </div>
    </div>
  );
}

UsersList.propTypes = {
  users: PropTypes.array
};

UserData.propTypes = {
  user: PropTypes.object
};
