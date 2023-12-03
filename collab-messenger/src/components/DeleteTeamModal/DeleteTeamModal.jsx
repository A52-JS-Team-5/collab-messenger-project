import PropTypes from "prop-types";
import cn from "classnames";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { deleteTeam, removeTeamFromUser } from "../../services/teams.services";
import { createNotification, pushNotifications } from "../../services/notifications.services";
import { DELETED_TEAM_NOTIFICATION, DELETED_TEAM_TYPE } from "../../common/constants";

const DeleteTeamModal = ({ teamData, teamId, isOpen, onClose }) => {
  const navigate = useNavigate();

  const modalClass = cn({
    "modal modal-bottom sm:modal-middle": true,
    "modal-open": isOpen,
  });

  const onLeave = (e) => {
    e.preventDefault();

    deleteTeam(teamId)
      .then(() => {
        navigate(`/app/teams`);

        return Promise.all(teamData.members.map((member) =>
          removeTeamFromUser(teamId, member))
        )
      })
      .then(() => {
        return createNotification(`${DELETED_TEAM_NOTIFICATION}: ${teamData.name}.`, DELETED_TEAM_TYPE)
      })
      .then((notificationId) =>
        Promise.all(teamData.members.map((member) =>
          pushNotifications(member, notificationId))))
      .catch(e => {
        toast('Error in deleting team. Please try again later.')
        console.log('Error deleting team: ', e.message);
      })

    onClose();
  }

  return (
    <div className="delete-team-wrapper">
      <div id="delete-team-modal" className={modalClass}>
        <div className="modal-box bg-pureWhite">
          <div className="post-description flex flex-col items-start">
            <h3 className="font-bold text-lg">Are you sure you want to delete this team?</h3>
            <p className="py-2">All related channels and files will be deleted.</p>
          </div>
          <div className="modal-action flex-row">
            <button className="btn btn-outline border-pink text-pink" onClick={onClose}>Cancel</button>
            <button type="button" onClick={(e) => onLeave(e)} className="btn bg-pink border-none text-pureWhite">Delete Team</button>
          </div>
        </div>
      </div>
    </div>
  );
}

DeleteTeamModal.propTypes = {
  teamData: PropTypes.object,
  teamId: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default DeleteTeamModal;