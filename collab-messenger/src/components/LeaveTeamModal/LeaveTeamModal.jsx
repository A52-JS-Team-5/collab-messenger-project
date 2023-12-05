import PropTypes from "prop-types";
import { useContext, useState } from "react";
import cn from "classnames";
import { useNavigate } from 'react-router-dom';
import AppContext from "../../context/AuthContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { removeTeamMember } from "../../services/teams.services";

const LeaveTeamModal = ({ teamId, isOpen, onClose }) => {
  const navigate = useNavigate();
  const loggedUser = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(isOpen)

  const modalClass = cn({
    "modal modal-bottom sm:modal-middle": true,
    "modal-open": isModalOpen,
  });

  const onLeave = (e) => {
    e.preventDefault();

    removeTeamMember(teamId, loggedUser.userData.handle)
      .then(() => {
        navigate(`/app/teams`);
      })
      .catch(e => {
        toast('Error in leaving team. Please try again later.')
        console.log('Error leaving team: ', e.message);
      })

      setIsModalOpen(false);
  }

  return (
    <div className="leave-team-wrapper">
      <div id="leave-team-modal" className={modalClass}>
        <div className="modal-box bg-pureWhite dark:bg-darkFront">
          <div className="post-description flex flex-col items-start">
            <h3 className="font-bold text-lg">You are about to leave.</h3>
            <p className="py-2">Are you sure you want to leave this team?</p>
          </div>
          <div className="modal-action flex-row">
            <button className="btn btn-outline border-pink text-pink" onClick={onClose}>Cancel</button>
            <button type="button" onClick={(e) => onLeave(e)} className="btn bg-pink border-none text-pureWhite">Leave Team</button>
          </div>
        </div>
      </div>
    </div>
  );
}

LeaveTeamModal.propTypes = {
  teamId: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

export default LeaveTeamModal;