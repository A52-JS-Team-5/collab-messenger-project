import { useState, useEffect, useContext } from "react";
import { addChat, createChat } from '../../services/chats.services';
import { getAllUsers } from "../../services/users.services";
import cn from "classnames";
import { useNavigate } from 'react-router-dom';
import ReactSelect from "react-select";
import AppContext from '../../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function StartGroupChatModal() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const handleToggle = () => setOpen((prev) => !prev);
  const [participant, setParticipant] = useState([]);
  const loggedUser = useContext(AppContext);
  const existingChats = loggedUser.userData?.chatParticipants || undefined;

  const modalClass = cn({
    "modal modal-bottom sm:modal-middle": true,
    "modal-open": open,
  });

  const navigate = useNavigate();

  const handlePrivateChatCreation = (event) => {
    event.preventDefault();
    
    if (existingChats && Object.keys(existingChats).includes(participant.value)) {
      navigate(`/app/chats/${existingChats[participant]}`)
    } else {
      createChat(participant, loggedUser.userData?.handle)
        .then((chatId) => {
          navigate(`/app/chats/${chatId}`);
          return chatId;
        })
        .then((chatId) => {
          return addChat(participant, loggedUser.userData?.handle, chatId);
        })
        .catch(e => {
          toast('Error in creating a new chat. Please try again later.')
          console.log('Error creating a new chat: ', e.message);
        })
    }
    
    handleToggle();
  }

  useEffect(() => {
    getAllUsers()
      .then((usersData) => {
        setUsers(usersData)
      })
      .catch(e => console.log(e.message))
  }, []);


  return (
    <div className="start-chat-view">
      <button className="btn btn-ghost btn-sm font-black" onClick={handleToggle}>+<i className="fa-solid fa-user fa-sm"></i></button>
      <div className={modalClass}>
        <div className="modal-box bg-light-gray">
          <div className="post-description flex flex-col gap-2 bg-light-gray">
            <h3 className="font-semibold leading-7 text-gray-900">Start A One-On-One Chat</h3>
            <div className="z-[100]">
              <label className="label">
                <span className="label-text text-black bg-transparent">Participant</span>
              </label>
              <div className="mt-2">
                {users.length !== 0 && (
                  <ReactSelect 
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected ? 'pink' : 'white',
                        color: 'black',
                      }),
                    }} 
                    classNames={{
                      control: () => "text-sm"
                    }} 
                    onChange={(selectedOption) => {setParticipant(selectedOption.value)}
                    } 
                    menuPortalTarget={document.body} 
                    options={users.map((user) => ({value: user.id, label: user.handle}))} 
                  />
                )}
              </div>
            </div>
          </div>
          <div className="modal-action flex-row">
            <button className="btn btn-outline text-pink bg-transparent" onClick={handleToggle}>Cancel</button>
            <button type="button" onClick={handlePrivateChatCreation} className="bg-pink text-white">Create Chat</button>
          </div>
        </div>
      </div>
    </div>
  );
}
