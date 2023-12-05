import cn from "classnames";
import PropTypes from "prop-types";
import { toast } from 'react-toastify';
import { useState, useContext } from "react";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import AppContext from "../../context/AuthContext";
import { leaveChat } from "../../services/chats.services";

export default function LeaveChatModal({ chatId }) {
  const navigate = useNavigate();
  const loggedUser = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const handleToggle = () => setOpen((prev) => !prev);

  const modalClass = cn({
    "modal modal-bottom sm:modal-middle": true,
    "modal-open": open,
  });

  const handleChatLeaving = (event) => {
    event.preventDefault();

    leaveChat(chatId, loggedUser.userData?.handle)
      .then(() => {
        navigate(`/app/chats`);
      })
      .catch(e => {
        toast('Error in leaving chat. Please try again later.')
        console.log('Error leaving chat: ', e.message);
      })
    
    handleToggle();
  };

  return (
    <div>
      <div className="rounded-full w-8 h-8 bg-lightBlue hover:cursor-pointer" title="Leave Chat" onClick={handleToggle}>
        <i className="fa-solid fa-right-from-bracket mt-2 text-blue"></i>
      </div>
      <div className={modalClass}>
        <div className="modal-box bg-pureWhite dark:bg-darkFront">
          <div className="post-description flex flex-col gap-2">
            <h3>Are you sure you want to leave this chat?</h3>
          </div>
          <div className="modal-action flex-row">
            <button className="btn btn-outline text-pink hover:bg-lightBlue" onClick={handleToggle}>Cancel</button>
            <button type="button" onClick={handleChatLeaving} className="btn text-pureWhite bg-pink hover:bg-lightBlue">Leave Chat</button>
          </div>
        </div>
      </div>
    </div>
  );
}

LeaveChatModal.propTypes = {
  chatId: PropTypes.string,
};
