import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../../context/AuthContext';
import { addChat, createChat } from '../../services/chats.services';

export default function UsersList({ users }) {
  return (
    <div className="grid grid-cols-5 grid-rows-3 gap-1 overflow-auto max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3 max-xl:grid-cols-4 gap-4 w-full [&::-webkit-scrollbar]:[width:8px]
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
    
    <div className='user-card flex flex-col gap-4 w-64 rounded-md justify-left items-start bg-pureWhite dark:bg-darkFront p-4 dark:text-darkText'>
      <div className='user-card-head'>
        <div className='author-description flex flex-row items-start gap-2'>
          <img className='w-12 h-12 object-cover rounded-full' src={user?.photoURL} />
          <div className='flex flex-col'>
            <div className="flex place-items-end text-lg font-semibold">{`${user.name} ${user.surname}`}</div>
            <div className="flex place-items-end text-sm">@{user.id}</div>
          </div>
        </div>
      </div>
      <div className='h-12 flex flex-col w-full'>
        <div className='text-sm flex place-items-end'>Member since: {(user?.createdOn)}</div>
        <div className='flex place-self-end'>
            {loggedUser?.userData && user?.handle !== loggedUser.userData?.handle && 
              <div className="cursor-pointer pr-3" onClick={startChat}><i className="fa-solid fa-comment text-lightBlue"></i></div>
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
