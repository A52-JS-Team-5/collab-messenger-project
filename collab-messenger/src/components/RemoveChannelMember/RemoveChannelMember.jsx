import cn from "classnames";
import { useState } from "react";
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { REMOVED_FROM_CHANNEL_TYPE, REMOVED_NOTIFICATION } from "../../common/constants";
import { createNotification, pushNotifications } from "../../services/notifications.services";
import { leaveChannel } from "../../services/channels.services";

const RemoveChannelMember = ({ channelId, userHandle, channelName, teamTitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen((prev) => !prev);

  const modalClass = cn({
    "modal modal-bottom sm:modal-middle": true,
    "modal-open": isOpen,
  });

  const handleCancelClick = (e) => {
    e.stopPropagation();
    handleToggle();
  };

    const handleConfirmMemberRemoval = () => {
      leaveChannel(channelId, userHandle)
        .then(() => {
          toast('Member removed successfully.');
          return createNotification(`${REMOVED_NOTIFICATION} ${channelName} in ${teamTitle}.`, REMOVED_FROM_CHANNEL_TYPE);
        })
        .then(notificationId => {
          return pushNotifications(userHandle, notificationId);
        })
        .catch((error) => {
          console.log(error.message);
          toast('An error occurred while trying to remove channel member.')
        });

      handleToggle();
    };

    return (
        <div className="remove-channel-member-wrapper">
            <button className="btn btn-square btn-ghost btn-sm text-blue hover:bg-blue30 focus:!bg-blue30 dark:text-yellow" onClick={(e) => handleCancelClick(e)}><i className="fa-solid fa-user-minus"></i></button>
            <div id="remove-channel-member-modal" className={modalClass}>
                <div className="modal-box bg-pureWhite dark:bg-darkAccent">
                    <h3 className="font-bold text-lg">Are you sure you want to remove this member?</h3>
                    <p className="py-2">You can always add them back later if needed.</p>
                    <div className="modal-action flex-row">
                        <button className="btn btn-outline border-pink text-pink" onClick={handleToggle}>Cancel</button>
                        <button type="button" className="btn bg-pink border-none text-pureWhite" onClick={handleConfirmMemberRemoval}>Remove Member</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

RemoveChannelMember.propTypes = {
  channelId: PropTypes.string,
  userHandle: PropTypes.string,
  channelName: PropTypes.string,
  teamTitle: PropTypes.string
};

export default RemoveChannelMember;
