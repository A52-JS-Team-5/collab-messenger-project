import { useState } from "react";
import cn from 'classnames'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addChannel, createChannel } from "../../services/channels.services";
import PropTypes from "prop-types";
import { createNotification, pushNotifications } from "../../services/notifications.services";
import { CREATED_CHANNEL_NOTIFICATION, CREATED_CHANNEL_TYPE } from "../../common/constants";

export default function AddChannelModal({ teamId, teamParticipants, teamOwner, isOpen, onClose, teamName }) {
  const [teamChannelTitle, setTeamChannelTitle] = useState('');

  const modalClass = cn({
    "modal modal-bottom sm:modal-middle": true,
    "modal-open": isOpen,
  });

  const navigate = useNavigate();

  const handleTeamChannelCreation = (e) => {
    e.preventDefault();

    if(!teamChannelTitle) {
      toast('You must include a title for the channel!');
      return;
    }

    // add a check to see if there is already a channel with the same name

    createChannel(teamId, teamChannelTitle, teamParticipants)
      .then((channelId) => {
        addChannel(teamParticipants, channelId, teamId, teamOwner)
        return channelId;
      })
      .then((channelId) => {
        navigate(`/app/teams/${teamId}/${channelId}`);
      })
      .then(() => {
        // the notifications don't work properly
        return createNotification(`${CREATED_CHANNEL_NOTIFICATION}: ${teamName}`, CREATED_CHANNEL_TYPE)
      })
      .then((notificationId) => {
        Promise.all(teamParticipants.map((member) => {
          pushNotifications(member, notificationId)
        }))
      })
      .catch((e) => {
        console.log(`Error creating a new channel: ${e.message}`);
      })

      onClose();
  }

  return (
    <div className="start-chat-view">
      <div className={modalClass}>
        <div className="modal-box bg-light-gray">
          <div className="post-description flex flex-col gap-2 bg-light-gray">
            <h3 className="font-semibold leading-7 text-gray-900">Create A Channel</h3>
            <div>
              <label className="label">
                <span className="label-text text-black bg-transparent">Channel Title</span>
              </label>
              <input type="text" defaultValue={teamChannelTitle} onChange={(e) => {setTeamChannelTitle(e.target.value)}} className="input input-bordered w-full text-black bg-white" />
            </div>
          </div>
          <div className="modal-action flex-row">
            <button className="btn btn-outline text-pink bg-transparent" onClick={onClose}>Cancel</button>
            <button type="button" onClick={handleTeamChannelCreation} className="bg-pink text-white">Create Channel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

AddChannelModal.propTypes = {
  teamId: PropTypes.string,
  teamParticipants: PropTypes.array,
  teamOwner: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  teamName: PropTypes.string,
}