import PropTypes from "prop-types";
import { useState } from "react";
import cn from "classnames";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { deleteChannel } from "../../services/channels.services";
import { DELETED_CHANNEL_NOTIFICATION, DELETED_CHANNEL_TYPE } from "../../common/constants";
import { createNotification, pushNotifications } from "../../services/notifications.services";

const DeleteChannelModal = ({ channelData }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen((prev) => !prev);

  const modalClass = cn({
    "modal modal-bottom sm:modal-middle": true,
    "modal-open": isOpen,
  });

  const handleChannelDeletion = (e) => {
    e.preventDefault();

    deleteChannel(channelData)
      .then(() => {
        navigate(`/app/teams/${channelData.team}`);
        toast('Channel was deleted successfully');
        return createNotification(`${DELETED_CHANNEL_NOTIFICATION}: ${channelData.title}.`, DELETED_CHANNEL_TYPE);
      })
      .then(notificationId => {
        Promise.all(Object.keys(channelData.participants).map((participant) =>
          pushNotifications(participant, notificationId)));
      })
      .catch((error) => {
        console.log(error.message);
        toast('An error occurred while trying to remove the channel.')
      })
  }

  const handleCancelClick = (e) => {
    e.stopPropagation();
    handleToggle();
}

  return (
    <div className="remove-team-member-wrapper">
      <button className="btn btn-square btn-ghost btn-sm text-blue hover:bg-blue30 focus:!bg-blue30 dark:text-yellow" onClick={(e) => handleCancelClick(e)}><i className="fa-solid fa-trash"></i></button>
      <div id="remove-team-member-modal" className={modalClass}>
        <div className="modal-box bg-pureWhite dark:bg-darkAccent">
          <h3 className="font-bold text-lg">Are you sure you want to delete this channel?</h3>
          <p className="py-2">This action is irreversible.</p>
          <div className="modal-action flex-row">
            <button className="btn btn-outline border-pink text-pink" onClick={handleToggle}>Cancel</button>
            <button type="button" className="btn bg-pink border-none text-pureWhite" onClick={(e) => handleChannelDeletion(e)}>Delete Channel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

DeleteChannelModal.propTypes = {
  channelData: PropTypes.object,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default DeleteChannelModal;