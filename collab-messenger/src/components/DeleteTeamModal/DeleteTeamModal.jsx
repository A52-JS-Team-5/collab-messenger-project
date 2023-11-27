import PropTypes from "prop-types";
import cn from "classnames";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { deleteTeam } from "../../services/teams.services";
import { useState } from "react";

const DeleteTeamModal = ({ teamId, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(isOpen)

  const modalClass = cn({
    "modal modal-bottom sm:modal-middle": true,
    "modal-open": isModalOpen,
  });

  const onLeave = (e) => {
    e.preventDefault();

    deleteTeam(teamId)
      .then(() => {
        navigate(`/app/teams`);
      })
      .catch(e => {
        toast('Error in deleting team. Please try again later.')
        console.log('Error deleting team: ', e.message);
      })

      setIsModalOpen(false);
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
  teamId: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default DeleteTeamModal;