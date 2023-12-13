import { useState, useContext, useRef } from "react";
import { createGroupChat, addGroupChat } from '../../services/chats.services';
import { searchUsers } from "../../services/users.services";
import cn from "classnames";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MIN_GROUP_CHAT_MEMBERS } from "../../common/constants";
import AppContext from '../../context/AuthContext';

export default function StartGroupChatModal() {
  const [open, setOpen] = useState(false);
  const handleToggle = () => setOpen((prev) => !prev);
  const [groupChatTitle, setGroupChatTitle] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const inputRef = useRef();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const loggedUser = useContext(AppContext);

  const modalClass = cn({
    "modal modal-bottom sm:modal-middle": true,
    "modal-open": open,
  });

  const navigate = useNavigate();

  const handleGroupChatCreation = (event) => {
    event.preventDefault();

    if (!groupChatTitle) {
      toast('You must include a title for the group chat!');
      return;
    }

    if (selectedMembers.length < MIN_GROUP_CHAT_MEMBERS) {
      toast(`You must add at least ${MIN_GROUP_CHAT_MEMBERS} users in the group chat!`);
      return;
    }

    const finalChatParticipants = selectedMembers.map(member => ({ value: member.handle }));

    createGroupChat(groupChatTitle, [...finalChatParticipants, { value: loggedUser.userData?.handle }])
      .then((chatId) => {
        addGroupChat(chatId, [...finalChatParticipants, { value: loggedUser.userData?.handle }]);
        return chatId;
      })
      .then((chatId) => {
        navigate(`${chatId}`);
      })
      .catch((e) => {
        console.log('Error creating a new chat: ', e.message);
      });

    handleToggle();
    setGroupChatTitle('');
    setSelectedMembers([]);
    setSearchResults([]);
    inputRef.current.value = '';
  };

  const handleAddMember = (userId) => {
    const userToAdd = searchResults.find((user) => user.id === userId);

    if (userToAdd) {
      setSelectedMembers((prevMembers) => [...prevMembers, userToAdd]);
      inputRef.current.value = '';
      handleSearchUsers('');
      setSearchResults([]);
    }
  };

  const handleRemoveMember = (handle) => {
    setSelectedMembers((prevMembers) => prevMembers.filter((member) => member.handle !== handle));
  };

  const handleSearchUsers = (query) => {
    if (query.trim() !== "") {
      searchUsers(query)
        .then((users) => {
          const filteredUsers = users.filter(user => user.id !== loggedUser?.userData?.handle);
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
    setGroupChatTitle('');
    setSelectedMembers([]);
    setSearchResults([]);
    inputRef.current.value = '';
  }

  return (
    <div className="start-chat-view">
      <button className="btn btn-ghost btn-sm font-black text-blue dark:text-yellow" onClick={handleToggle}>+<i className="fa-solid fa-user-group fa-sm"></i></button>
      <div className={modalClass}>
        <div className="modal-box bg-pureWhite dark:bg-darkFront">
          <div className="flex flex-col gap-2">
            <div>
              <div className="flex flex-col items-start">
                <h3 className="font-semibold text-gray-900 dark:text-darkText text-left">Create A Group Chat</h3>
                <p className="py-2 text-left dark:text-darkText">Initiate a group chat with at least 2 other users.</p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-black bg-transparent dark:text-darkText">Chat Title</span>
                </label>
                <input type="text" value={groupChatTitle} onChange={(e) => setGroupChatTitle(e.target.value)} className="input input-bordered w-full text-black bg-pureWhite dark:bg-darkInput dark:text-darkText" />
              </div>
              <div className="z-[100]">
                <label className="label">
                  <span className="label-text text-black bg-transparent dark:text-darkText">Participants</span>
                </label>
                <input type="text" ref={inputRef} onChange={(e) => handleSearchUsers(e.target.value)}
                  className="input input-bordered w-full text-black bg-pureWhite dark:bg-darkInput dark:text-darkText"
                />
                <div className="scrollable-list-container flex flex-col gap-2 mt-2">
                  {/* Display search results */}
                  {searchResults.length > 0 && (
                    <ul className="scrollable-list max-h-24	overflow-y-auto">
                      {searchResults.map((user) => (
                        <li key={user.id} onClick={() => handleAddMember(user.id)} className='cursor-pointer flex flex-row gap-2 items-center hover:bg-pureWhite pt-1 pb-1 pl-2 pr-2 dark:hover:bg-darkAccent rounded-md dark:text-darkText'>
                          <img src={user.photoURL} className='h-8 w-8 rounded-full' />
                          <div className='flex flex-col items-start'>
                            <p className='text-sm'>{user.name}{' '}{user.surname}</p>
                            <p className='text-xs'>{`@${user.id}`}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              {/* Display selected members */}
              {selectedMembers.length > 0 && (
                <div className="selected-members mt-1">
                  <ul className='flex flex-wrap gap-2'>
                    {selectedMembers.map((member) => (
                      <li key={member.id} className='badge badge-outline gap-2 p-4 dark:text-darkText'>
                        <img src={member.photoURL} className='h-4 w-4 rounded-full' />
                        {member.name}{' '}{member.surname}
                        <i className="fa-solid fa-x cursor-pointer" onClick={() => handleRemoveMember(member.handle)}></i>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="modal-action flex-row">
            <button className="btn btn-outline text-pink bg-transparent" onClick={handleCancel}>Cancel</button>
            <button type="button" onClick={handleGroupChatCreation} className="bg-pink text-white">Create Chat</button>
          </div>
        </div>
      </div>
    </div>
  );
}
