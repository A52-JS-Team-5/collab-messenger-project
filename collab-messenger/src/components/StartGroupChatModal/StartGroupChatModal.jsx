import { useState, useEffect } from "react";
import { addGroupChat, createGroupChat } from '../../services/chats.services';
import { getAllUsers } from "../../services/users.services";
import cn from "classnames";
import { useNavigate } from 'react-router-dom';
import ReactSelect from "react-select";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MIN_GROUP_CHAT_MEMBERS } from "../../common/constants";

export default function StartGroupChatModal() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const handleToggle = () => setOpen((prev) => !prev);
  const [title, setTitle] = useState('');
  const [participants, setParticipants] = useState([]);

  const modalClass = cn({
    "modal modal-bottom sm:modal-middle": true,
    "modal-open": open,
  });

  const navigate = useNavigate();

  const createChat = (event) => {
    event.preventDefault();

    if(!title) {
      toast('You must include a title for the group chat!');
      return;
    }

    if(participants.length < MIN_GROUP_CHAT_MEMBERS) {
      toast('You must add at least 3 users in the group chat!');
      return;
    }

    createGroupChat(title, participants)
      .then((chatId) => {
        addGroupChat(chatId, participants)
        return chatId;
      })
      .then((chatId) => {
        navigate(`/chats/${chatId}`);
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
      <button className="btn btn-ghost font-black" onClick={handleToggle}>+<i className="fa-solid fa-user-group"></i></button>
      <div className={modalClass}>
        <div className="modal-box">
          <div className="post-description flex flex-col gap-2">
            <h3 className="font-semibold leading-7 text-gray-900">Create A Group Chat</h3>
            <p className="mt-1 text-sm leading-6 text-gray-600">Create a chat with more than 2 users.</p>
            <div>
              <label className="label">
                <span className="label-text">Chat Title</span>
              </label>
              <input type="text" defaultValue={title} onChange={(e) => {setTitle(e.target.value)}} className="input input-bordered w-full text-white" />
            </div>
            <div className="z-[100]">
              <label className="block text-sm font-medium leading-6 text-gray-900">Participants</label>
              <div className="mt-2">
                {users.length !== 0 && <ReactSelect styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? 'blue' : 'white',
                    color: 'black',
                   }),
                }} classNames={{
                  control: () => "text-sm"
                }} onChange={(selectedOptions) => {setParticipants(selectedOptions)}} isMulti menuPortalTarget={document.body} options={users.map((user) => ({value: user.id, label: user.handle}))} />}
              </div>
            </div>
          </div>
          <div className="modal-action flex-row">
            <button className="btn btn-outline btn-warning" onClick={handleToggle}>Cancel</button>
            <button type="button" onClick={createChat} className="btn btn-warning">Create Chat</button>
          </div>
        </div>
      </div>
    </div>
  );
}
