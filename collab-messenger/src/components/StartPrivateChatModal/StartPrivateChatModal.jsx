import { useState, useEffect, useContext, useRef } from "react";
import { addChat, createChat } from '../../services/chats.services';
import { searchUsers } from "../../services/users.services";
import cn from "classnames";
import { useNavigate } from 'react-router-dom';
import AppContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { onValue, ref } from "firebase/database";
import { db } from "../../config/firebase-config";

export default function StartGroupChatModal() {
  const [open, setOpen] = useState(false);
  const handleToggle = () => setOpen((prev) => !prev);
  const [participant, setParticipant] = useState({});
  const loggedUser = useContext(AppContext);
  const [existingChats, setExistingChats] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    if (loggedUser?.userData?.handle) {
      const userRef = ref(db, `users/${loggedUser.userData.handle}/chatParticipants`);

      const userListener = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          setExistingChats(snapshot.val());
        } else {
          setExistingChats({});
        }
      });

      return () => {
        userListener();
      };
    }
  }, [loggedUser?.userData?.handle]);

  const modalClass = cn({
    "modal modal-bottom sm:modal-middle": true,
    "modal-open": open,
  });

  const navigate = useNavigate();

  const handlePrivateChatCreation = (event) => {
    event.preventDefault();

    if (!participant.id) {
      toast('You must add a user to continue!');
      return;
    }

    if (existingChats && Object.keys(existingChats).includes(participant.id)) {
      navigate(`/app/chats/${existingChats[participant.id]}`);
    } else {
      //console.log(participant.id, loggedUser?.userData?.handle);
      createChat(participant.handle, loggedUser?.userData?.handle)
        .then((chatId) => {
          navigate(`/app/chats/${chatId}`);
          return chatId;
        })
        .then((chatId) => {
          return addChat(participant.id, loggedUser.userData?.handle, chatId);
        })
        .catch(e => {
          toast('Error in creating a new chat. Please try again later.')
          console.log('Error creating a new chat: ', e.message);
        })
    }

    handleToggle();
    inputRef.current.value = '';
    setSearchResults([]);
    setParticipant({});
  }

  const handleAddMember = (userId) => {
    const userToAdd = searchResults.find((user) => user.id === userId);
    //console.log(userToAdd);
    if (userToAdd) {
      setParticipant(userToAdd);
      inputRef.current.value = '';
      handleSearchUsers('');
      setSearchResults([]);
    }
  }

  const handleRemoveMember = () => {
    setParticipant({});
    inputRef.current.value = '';
    handleSearchUsers('');
    setSearchResults([]);
  };

  const handleSearchUsers = (query) => {
    if (query.trim() !== "") {
      searchUsers(query)
        .then((data) => {
          const filteredUsers = data.filter(user => user.id !== loggedUser?.userData?.handle)
          setSearchResults(filteredUsers);
        })
        .catch((error) => {
          console.error(error.message);
        });
    } else {
      setSearchResults([]);
    }
  };

  const handleCancel = () => {
    handleToggle();
    inputRef.current.value = '';
    setSearchResults([]);
    setParticipant({});
  }

  return (
    <div className="start-chat-view">
      <button className="btn btn-ghost btn-sm font-black text-blue dark:text-yellow" onClick={handleToggle}>+<i className="fa-solid fa-user fa-sm"></i></button>
      <div className={modalClass}>
        <div className="modal-box bg-pureWhite dark:bg-darkFront">
          <div className="flex flex-col gap-2">
            <div>
              <div className="flex flex-col items-start">
                <h3 className="font-semibold text-gray-900 dark:text-darkText text-left">Start A One-On-One Chat</h3>
                <p className="py-2 text-left dark:text-darkText">Initiate a one-on-one chat to start your conversation.</p>
              </div>
              <label className="label">
                <span className="label-text dark:text-darkText">Search for a User</span>
              </label>
              <input type="text" ref={inputRef} onChange={(e) => handleSearchUsers(e.target.value)} className="input input-bordered w-full text-black bg-pureWhite dark:bg-darkInput dark:text-darkText" />
              <div className="scrollable-list-container flex flex-col gap-2 mt-2">
                {/* Display search results */}
                {searchResults.length > 0 && (
                  <ul className="scrollable-list max-h-24 overflow-y-auto">
                    {searchResults.map((user) => (
                      <li key={user.id} onClick={() => handleAddMember(user.id)} className='cursor-pointer flex flex-row gap-2 items-center hover:bg-pureWhite pt-1 pb-1 pl-2 pr-2 dark:hover:bg-darkAccent dark:text-darkText'>
                        <img src={user.photoURL} className='h-8 w-8 rounded-full' />
                        <div className='flex flex-col items-start self-stretch'>
                          <p className='text-sm'>{user.name}{' '}{user.surname}</p>
                          <p className='text-xs'>{`@${user.id}`}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {/* Display selected member */}
            {participant.id && <div className="selected-members">
              <ul className='flex flex-wrap gap-2'>
                <li key={participant.id} className='badge badge-outline gap-2 p-4 dark:text-darkText'>
                  <img src={participant.photoURL} className='h-4 w-4 rounded-full' />
                  {participant.name}{' '}{participant.surname}
                  <i className="fa-solid fa-x cursor-pointer" onClick={handleRemoveMember}></i>
                </li>
              </ul>
            </div>}
          </div>
          <div className="modal-action flex-row">
            <button className="btn btn-outline border-pink text-pink" onClick={handleCancel}>Cancel</button>
            <button type="button" onClick={e => handlePrivateChatCreation(e)} className="btn bg-pink border-none text-pureWhite">Create Chat</button>
          </div>
        </div>
      </div>
    </div>
  );
}
