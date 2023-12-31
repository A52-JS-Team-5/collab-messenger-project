import PropTypes from "prop-types";
import { useState, useContext } from "react";
import cn from "classnames";
import { useNavigate } from 'react-router-dom';
import AppContext from "../../context/AuthContext";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { leaveChannel } from "../../services/channels.services";

export default function LeaveChannelModal({ channelId }) {
  const navigate = useNavigate();
  const loggedUser = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const handleToggle = () => setOpen((prev) => !prev);

  const modalClass = cn({
    "modal modal-bottom sm:modal-middle": true,
    "modal-open": open,
  });

  const onLeave = (event) => {
    event.preventDefault();

    leaveChannel(channelId, loggedUser.userData.handle)
      .then(() => {
        toast('You left the channel successfully.')
        navigate(`/app/teams/`);
      })
      .catch(e => {
        toast('Error in leaving channel. Please try again later.')
        console.log('Error leaving channel: ', e.message);
      })
    
    handleToggle();
  }

  return (
    <div>
      <div className="rounded-full w-8 h-8 bg-lightBlue hover:cursor-pointer" title="Leave Channel" onClick={handleToggle}>
        <i className="fa-solid fa-right-from-bracket mt-2 text-blue"></i>
      </div>
      <div className={modalClass}>
        <div className="modal-box bg-pureWhite dark:bg-darkFront dark:text-darkText">
          <div className="post-description flex flex-col gap-2">
            <h3>Are you sure you want to leave this channel?</h3>
          </div>
          <div className="modal-action flex-row">
            <button className="btn btn-outline text-pink hover:bg-lightBlue" onClick={handleToggle}>Cancel</button>
            <button type="button" onClick={onLeave} className="btn text-pureWhite bg-pink hover:bg-lightBlue">Leave Channel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

LeaveChannelModal.propTypes = {
  channelId: PropTypes.string,
};
