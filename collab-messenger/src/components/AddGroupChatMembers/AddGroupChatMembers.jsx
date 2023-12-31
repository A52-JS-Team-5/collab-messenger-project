import { useState, useEffect } from "react";
import { updateGroupChatParticipants } from '../../services/chats.services';
import { getAllUsers } from "../../services/users.services";
import cn from "classnames";
import ReactSelect from "react-select";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from "prop-types";

export default function AddGroupChatMembers({ chatId, chatParticipants }) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const handleToggle = () => setOpen((prev) => !prev);
  const [participants, setParticipants] = useState([]);

  const modalClass = cn({
    "modal modal-bottom sm:modal-middle": true,
    "modal-open": open,
  });

  const handleAddingMoreParticipants = (event) => {
    event.preventDefault();

    updateGroupChatParticipants(chatId, participants)
      .then(() => toast('Participant(s) added successfully.'))
      .catch(e => console.log('Error adding participants: ', e.message));
    
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
      <div className="rounded-full w-8 h-8 bg-lightBlue hover:cursor-pointer" title="Add More Participants" onClick={handleToggle}>
        <i className="fa-regular fa-square-plus mt-2 text-blue"></i>
      </div>
      <div className={modalClass}>
        <div className="modal-box bg-pureWhite dark:bg-darkFront">
          <div className="post-description flex flex-col gap-2">
            <h3 className="font-semibold leading-7 text-gray-900">Include More Participants In Your Chat</h3>
            <div className="z-[100]">
              <label className="label">
                <span className="label-text text-black bg-transparent dark:text-darkText">Users</span>
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
                    onChange={(selectedOptions) => {setParticipants(selectedOptions)}
                    } 
                    isMulti
                    menuPortalTarget={document.body} 
                    options={users
                      .filter(user => !chatParticipants.includes(user.handle))
                      .map((user) => ({value: user.id, label: user.handle}))} 
                  />
                )}
              </div>
            </div>
          </div>
          <div className="modal-action flex-row">
            <button className="btn btn-outline text-pink bg-transparent" onClick={handleToggle}>Cancel</button>
            <button type="button" onClick={handleAddingMoreParticipants} className="btn bg-pink border-none text-white">Add Participants</button>
          </div>
        </div>
      </div>
    </div>
  );
}

AddGroupChatMembers.propTypes = {
  chatId: PropTypes.string,
  chatParticipants: PropTypes.array,
};
