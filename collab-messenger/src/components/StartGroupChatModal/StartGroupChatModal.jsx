import { useState, useEffect, useContext } from "react";
import { addGroupChat, createGroupChat } from '../../services/chats.services';
import { getAllUsers } from "../../services/users.services";
import cn from "classnames";
import { useNavigate } from 'react-router-dom';
import ReactSelect from "react-select";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MIN_GROUP_CHAT_MEMBERS } from "../../common/constants";
import AppContext from '../../context/AuthContext';

export default function StartGroupChatModal() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const handleToggle = () => setOpen((prev) => !prev);
  const [groupChatTitle, setGroupChatTitle] = useState('');
  const [groupChatParticipants, setGroupChatParticipants] = useState([]);
  const loggedUser = useContext(AppContext);

  const modalClass = cn({
    "modal modal-bottom sm:modal-middle": true,
    "modal-open": open,
  });

  const navigate = useNavigate();

  const handleGroupChatCreation = (event) => {
    event.preventDefault();

    if(!groupChatTitle) {
      toast('You must include a title for the group chat!');
      return;
    }

    if(groupChatParticipants.length < MIN_GROUP_CHAT_MEMBERS) {
      toast('You must add at least 2 users in the group chat!');
      return;
    }

    const finalChatParticipants = [...groupChatParticipants, { value: loggedUser.userData?.handle }];
    
    createGroupChat(groupChatTitle, finalChatParticipants)
      .then((chatId) => {
        addGroupChat(chatId, finalChatParticipants)
        return chatId;
      })
      .then((chatId) => {
        navigate(`${chatId}`);
      })
      .catch(e => {
        console.log('Error creating a new chat: ', e.message);
      })
    
    handleToggle();
  }

  useEffect(() => {
    getAllUsers()
      .then((usersData) => {
        setUsers(usersData)
      })
      .catch(e => console.log(e.message))
  }, [])

  return (
    <div className="start-chat-view">
      <button className="btn btn-ghost btn-sm font-black text-blue dark:text-yellow" onClick={handleToggle}>+<i className="fa-solid fa-user-group fa-sm"></i></button>
      <div className={modalClass}>
        <div className="modal-box bg-light-gray">
          <div className="post-description flex flex-col gap-2 bg-light-gray">
            <h3 className="font-semibold leading-7 text-gray-900">Create A Group Chat</h3>
            <p className="mt-1 text-sm leading-6 text-gray-600">Create a chat with more than 2 users.</p>
            <div>
              <label className="label">
                <span className="label-text text-black bg-transparent">Chat Title</span>
              </label>
              <input type="text" defaultValue={groupChatTitle} onChange={(e) => {setGroupChatTitle(e.target.value)}} className="input input-bordered w-full text-black bg-white" />
            </div>
            <div className="z-[100]">
              <label className="label">
                <span className="label-text text-black bg-transparent">Participants</span>
              </label>
              <div className="mt-2">
              {users.length !== 0 && <ReactSelect styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? 'pink' : 'white',
                    color: 'black',
                   }),
                  }} classNames={{
                    control: () => "text-sm"
                  }} onChange={(selectedOptions) => {setGroupChatParticipants(selectedOptions)}} 
                  isMulti 
                  menuPortalTarget={document.body} 
                  options={users
                    .filter(user => user.handle !== loggedUser.userData.handle)
                    .map((user) => ({value: user.id, label: user.handle}))} />
                }
              </div>
            </div>
          </div>
          <div className="modal-action flex-row">
            <button className="btn btn-outline text-pink bg-transparent" onClick={handleToggle}>Cancel</button>
            <button type="button" onClick={handleGroupChatCreation} className="bg-pink text-white">Create Chat</button>
          </div>
        </div>
      </div>
    </div>
  );
}
