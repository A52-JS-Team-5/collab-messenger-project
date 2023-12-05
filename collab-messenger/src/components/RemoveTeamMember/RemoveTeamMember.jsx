import cn from "classnames";
import { useState } from "react";
import { removeTeamMember } from "../../services/teams.services";
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createNotification, pushNotifications } from "../../services/notifications.services";
import { REMOVED_FROM_TEAM_TYPE, REMOVED_NOTIFICATION } from "../../common/constants";

const RemoveTeamMember = ({ teamId, teamName, memberId }) => {
    const [open, setOpen] = useState(false);
    const handleToggle = () => setOpen((prev) => !prev);

    const modalClass = cn({
        "modal modal-bottom sm:modal-middle": true,
        "modal-open": open,
    });

    const handleCancelClick = (e) => {
        e.stopPropagation();
        handleToggle();
    }

    const handleConfirmMemberRemoval = () => {

        removeTeamMember(teamId, memberId)
            .then(() => {
                toast('Member(s) removed successfully.');

                return createNotification(`${REMOVED_NOTIFICATION} ${teamName}.`, REMOVED_FROM_TEAM_TYPE);
            })
            .then(notificationId => {
                return pushNotifications(memberId, notificationId);
            })
            .catch((error) => {
                console.log(error.message);
                toast('An error occurred while trying to remove team member.')
            });

        handleToggle();
    };

    return (
        <div className="remove-team-member-wrapper">
            <button className="btn btn-square btn-ghost btn-sm text-blue hover:bg-blue30 focus:!bg-blue30" onClick={(e) => handleCancelClick(e)}><i className="fa-solid fa-user-minus"></i></button>
            <div id="remove-team-member-modal" className={modalClass}>
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

RemoveTeamMember.propTypes = {
    teamId: PropTypes.string,
    teamName: PropTypes.string,
    memberId: PropTypes.string,
};

export default RemoveTeamMember;