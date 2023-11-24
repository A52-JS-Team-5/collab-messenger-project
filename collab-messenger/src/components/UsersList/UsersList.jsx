import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../../context/AuthContext';
import { addChat, createChat } from '../../services/chats.services';

export default function UsersList({ users }) {

  return (
    <div className="flex flex-col gap-2">
      {users.map(user => {
        return (
          <div className="users-display" key={user.id} >
            <UserData user={user}/>
          </div>
        )})
      }
    </div>
  )
}

function UserData({ user }) {
  const navigate = useNavigate();
  const loggedUser = useContext(AppContext);
  const existingChats = loggedUser?.userData?.chatParticipants;
  const existingChatId = existingChats[`${user.handle}`];

  const startChat = (event) => {
    event.preventDefault();

    if (Object.keys(existingChats).includes(user.handle) && existingChatId) {
      navigate(`/chats/${existingChatId}`)
    } else {
      createChat(user.handle, loggedUser.userData.handle)
        .then((chatId) => {
          navigate(`/chats/${chatId}`);
          return chatId;
        })
        .then((chatId) => {
          return addChat(user.handle, loggedUser.userData.handle, chatId);
        })
        .catch(e => {
          console.log('Error creating a new chat: ', e.message);
        })
    }

  }

  return (
    <div className='user-card flex flex-col gap-4 rounded-md border border-black items-start'>
      <div className='user-card-head'>
        <div className='author-description flex flex-col items-start'>
          <div className='handle' onClick={() => navigate(`/users/${user?.id}`)}>{user?.id}</div>
          <div className='email'>{user?.email}</div>
        </div>
      </div>
      <div className='joined-on'>Joined On: {(user?.createdOn)}</div>
      <div className='user-card-footer'>
        <div className='flex flex-row gap-2'>
            <div className='flex flex-row gap-2'>
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512"><path d="M211.2 96a64 64 0 1 0 -128 0 64 64 0 1 0 128 0zM32 256c0 17.7 14.3 32 32 32h85.6c10.1-39.4 38.6-71.5 75.8-86.6c-9.7-6-21.2-9.4-33.4-9.4H96c-35.3 0-64 28.7-64 64zm461.6 32H576c17.7 0 32-14.3 32-32c0-35.3-28.7-64-64-64H448c-11.7 0-22.7 3.1-32.1 8.6c38.1 14.8 67.4 47.3 77.7 87.4zM391.2 226.4c-6.9-1.6-14.2-2.4-21.6-2.4h-96c-8.5 0-16.7 1.1-24.5 3.1c-30.8 8.1-55.6 31.1-66.1 60.9c-3.5 10-5.5 20.8-5.5 32c0 17.7 14.3 32 32 32h224c17.7 0 32-14.3 32-32c0-11.2-1.9-22-5.5-32c-10.8-30.7-36.8-54.2-68.9-61.6zM563.2 96a64 64 0 1 0 -128 0 64 64 0 1 0 128 0zM321.6 192a80 80 0 1 0 0-160 80 80 0 1 0 0 160zM32 416c-17.7 0-32 14.3-32 32s14.3 32 32 32H608c17.7 0 32-14.3 32-32s-14.3-32-32-32H32z"/></svg>
              <p>{user?.teamsMember?.length ? user?.teamsMember?.length : 0}</p>
            </div>
            {loggedUser.userData && user.handle !== loggedUser.userData.handle && 
            <div>
              <button className="btn btn-ghost" onClick={startChat}><i className="fa-solid fa-comment"></i></button>
            </div>
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
