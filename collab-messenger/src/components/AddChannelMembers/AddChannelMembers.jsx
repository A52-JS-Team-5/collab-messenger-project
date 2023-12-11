import { useState } from "react";
import { updateChannelParticipants } from "../../services/channels.services";
import cn from "classnames";
import ReactSelect from "react-select";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from "prop-types";

export default function AddChannelMembers({ channelId, channelParticipants, teamMembers }) {
  const [open, setOpen] = useState(false);
  const handleToggle = () => setOpen((prev) => !prev);
  const [participants, setParticipants] = useState([]);

  const modalClass = cn({
    "modal modal-bottom sm:modal-middle": true,
    "modal-open": open,
  });

  const handleAddingMoreParticipants = (event) => {
    event.preventDefault();

    updateChannelParticipants(channelId, participants)
      .then(() => toast('Participant(s) added successfully.'))
      .catch(e => console.log('Error adding participants: ', e.message));
    
    handleToggle();
  }

  return (
    <div className="start-chat-view">
      <div className="rounded-full w-8 h-8 bg-lightBlue hover:cursor-pointer" title="Add More Participants" onClick={handleToggle}>
        <i className="fa-regular fa-square-plus mt-2 text-blue"></i>
      </div>
      <div className={modalClass}>
        <div className="modal-box bg-light-gray">
          <div className="post-description flex flex-col gap-2 bg-light-gray">
            <h3 className="font-semibold leading-7 text-gray-900">Include More Participants In This Channel</h3>
            <div className="z-[100]">
              <label className="label">
                <span className="label-text text-black bg-transparent">Users</span>
              </label>
              <div className="mt-2">
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
                  onChange={(selectedOptions) => {setParticipants(selectedOptions)}} 
                  isMulti
                  menuPortalTarget={document.body} 
                  options={teamMembers
                    .filter(user => !channelParticipants.includes(user))
                    .map((user) => ({value: user, label: user}))} 
                />
              </div>
            </div>
          </div>
          <div className="modal-action flex-row">
            <button className="btn btn-outline text-pink bg-transparent" onClick={handleToggle}>Cancel</button>
            <button type="button" onClick={handleAddingMoreParticipants} className="bg-pink text-white">Add Participants</button>
          </div>
        </div>
      </div>
    </div>
  );
}

AddChannelMembers.propTypes = {
  channelId: PropTypes.string,
  channelParticipants: PropTypes.array,
  teamMembers: PropTypes.array
};
