import Avatar from '../Avatar/Avatar';
import { editMessage } from '../../services/messages.services';
import { useState } from 'react';
import PropTypes from 'prop-types';

export default function MessageBubble({ message, messageClass, userAvatar, editCommentOption }) {
  const [form, setForm] = useState('');
  const [showComment, setShowComment] = useState(true);
  const [originalContent, setOriginalContent] = useState(message.content);
  const isGif = message.content.includes('giphy');

  const onEdit = () => {
    setShowComment(!showComment);
    setForm(originalContent);
  };

  const onInputChange = (e) => {
    setForm(e.target.value);
  }

  const setNewContent = () => {
    editMessage(message.id, { content: form })
    setOriginalContent(form);
    setShowComment(true);
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowComment(true);
    }

    if (e.key === 'Enter') {
      setNewContent();
    }
  };

  return (
    <div id='chat-wrapper' className={`chat ${messageClass}`} >
      <Avatar user={userAvatar}/>
      <div className="chat-header gap-2">
        {message.author}
      </div>
      {showComment === false ? (
        <div key={message.id} className='flex space-between'>
          <input type="text" value={`${form}`} onChange={onInputChange} onKeyDown={handleKeyDown} className="input input-bordered input-xs w-full max-w-xs" />
          <button className="btn btn-ghost btn-xs flex self-center text-white" onClick={setNewContent}>Save</button>
        </div>
      ) : (
        isGif === true ? (
          <img
            src={message.content}
            alt="GIF"
          />
        ) : (
          <div className="chat-bubble">{message.content}</div>
        )
      )}
      <div className="chat-footer flex">
        {editCommentOption && (<div className="flex self-start pr-2 pt-0.5 text-xs opacity-50 hover:cursor-pointer" onClick={onEdit}><i className="fa-solid fa-pen-to-square"></i></div>)}
        <time className="text-xs opacity-50 flex self-end ">{new Date(message.createdOn).toLocaleDateString()}</time>
      </div>
    </div>
  )
}

MessageBubble.propTypes = {
  message: PropTypes.object,
  messageClass: PropTypes.string,
  userAvatar: PropTypes.string,
  editCommentOption: PropTypes.bool
}
