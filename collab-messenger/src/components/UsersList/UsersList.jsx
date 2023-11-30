import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../../context/AuthContext';
import { addChat, createChat } from '../../services/chats.services';

export default function UsersList({ users }) {

  return (
    <div className="grid grid-cols-5 grid-rows-2 gap-1 overflow-auto max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3 max-xl:grid-cols-4 [&::-webkit-scrollbar]:[width:8px]
    [&::-webkit-scrollbar-thumb]:bg-mint [&::-webkit-scrollbar-thumb]:rounded-md">
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
  const existingChats = loggedUser.userData?.chatParticipants || undefined;
  const existingChatId = existingChats ? existingChats[`${user?.handle}`] : undefined;

  const startChat = (event) => {
    event.preventDefault();
    if (existingChats && existingChatId && Object.keys(existingChats).includes(user?.handle)) {
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
    
    <div className='user-card w-64 rounded-md border border-black items-start'>
      <div className='user-card-head'>
        <div className='author-description flex flex-col items-start'>
          <div className='handle hover:cursor-pointer font-extrabold' onClick={() => navigate(`/app/users/${user?.id}`)}>{user?.id}</div>
          <div className='email'>{user?.email}</div>
        </div>
      </div>
      <div className='joined-on'>Joined On: {(user?.createdOn)}</div>
      <div className='user-card-footer h-8'>
        <div className='pl-40'>
            {loggedUser?.userData && user?.handle !== loggedUser.userData?.handle && 
              <button className="btn btn-ghost flex " onClick={startChat}><i className="fa-solid fa-comment"></i></button>
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
