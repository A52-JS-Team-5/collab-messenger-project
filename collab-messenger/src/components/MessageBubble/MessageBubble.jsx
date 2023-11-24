import Avatar from '../Avatar/Avatar';
import { editMessage } from '../../services/messages.services';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import QuickReactions from "react-quick-reactions";

export default function MessageBubble({ message, messageClass, userAvatar, editCommentOption }) {
  const [form, setForm] = useState('');
  const [showComment, setShowComment] = useState(true);
  const [areEmojisVisible, setAreEmojisVisible] = useState(false);
  const [originalContent, setOriginalContent] = useState(message.content);
  const [reactions, setReactions] = useState(message?.reactions || []);
  const isGif = message.content.includes('giphy');

  const onEdit = () => {
    setShowComment(!showComment);
    setForm(originalContent);
  };

  const onInputChange = (e) => {
    setForm(e.target.value);
  }

  const setNewContent = () => {
    editMessage(message.id, { content: form });
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

  const onReaction = (emoji) => {
    if (reactions.includes(emoji) === false) {
      setReactions(prevReactions => [...prevReactions, emoji]);
    }
  };

  useEffect(() => {
    editMessage(message.id, { reactions: reactions });
  }, [reactions, message.id]);

  return (
    <div id='chat-wrapper' className={`chat ${messageClass}`} >
      <Avatar user={userAvatar}/>
      <div className="chat-header ">
        {message.author}
        <time className="text-xs opacity-50 pl-1">{new Date(message.createdOn).toLocaleString()}</time>
      </div>

      {showComment === false ? ( // is edit button clicked on?
        // if yes -> show input
        <div key={message.id} className='flex space-between'>
          <input type="text" value={`${form}`} onChange={onInputChange} onKeyDown={handleKeyDown} className="input input-bordered input-xs w-full max-w-xs" />
          <button className="btn btn-ghost btn-xs flex self-center text-white" onClick={setNewContent}>Save</button>
        </div>
      ) : (
        // if no -> check if msg is gif
        isGif === true ? (
          // if yes -> display gif
          <div className='flex flex-row'>
            <img
              src={message.content}
              alt="GIF"
            />
            {/* edit option button */}
            {editCommentOption && (<div className="flex self-start pr-2 pt-0.5 text-xs opacity-50 hover:cursor-pointer pl-2" onClick={onEdit}><i className="fa-solid fa-pen-to-square"></i></div>)}
            {/* react option button -> can only react on other user's posts */}
            {editCommentOption !== true && (
              <div className='flex flex-row'>
                <div className="flex self-center pl-1 text-xs hover:cursor-pointer">
                  <QuickReactions
                    reactionsArray={[
                      {
                        id: "laughing",
                        name: "Laughing",
                        content: "😂",
                      },
                      {
                        id: "crying",
                        name: "Crying",
                        content: "😢",
                      },
                      {
                        id: "heart",
                        name: "Heart",
                        content: "❤️",
                      },
                      {
                        id: "thumbs-up",
                        name: "Thumbs Up",
                        content: "👍",
                      },
                      {
                        id: "thumbs-down",
                        name: "Thumbs Down",
                        content: "👎",
                      },
                    ]}
                    placement='right'
                    isVisible={areEmojisVisible}
                    onClose={() => setAreEmojisVisible(false)}
                    onClickReaction={(reaction) => {
                      onReaction(reaction.content)
                    }}
                    trigger={
                      <div className='flex self-center' onClick={() => setAreEmojisVisible(!areEmojisVisible)}><i className="fa-regular fa-face-smile opacity-50"></i></div>
                    }
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          // if it's is not a gif, show message content 
          <div className='flex flex-row'>
            {editCommentOption && (<div className="flex self-center pr-2 pt-0.5 text-xs opacity-50 hover:cursor-pointer pl-2" onClick={onEdit}><i className="fa-solid fa-pen-to-square"></i></div>)}
            <div className="chat chat-bubble">{message.content}</div>
            {editCommentOption !== true && (
              <div className='flex flex-row'>
                <div className="flex self-center pl-1 text-xs hover:cursor-pointer">
                  <QuickReactions
                    reactionsArray={[
                      {
                        id: "laughing",
                        name: "Laughing",
                        content: "😂",
                      },
                      {
                        id: "crying",
                        name: "Crying",
                        content: "😢",
                      },
                      {
                        id: "heart",
                        name: "Heart",
                        content: "❤️",
                      },
                      {
                        id: "thumbs-up",
                        name: "Thumbs Up",
                        content: "👍",
                      },
                      {
                        id: "thumbs-down",
                        name: "Thumbs Down",
                        content: "👎",
                      },
                    ]}
                    placement='right'
                    isVisible={areEmojisVisible}
                    onClose={() => setAreEmojisVisible(false)}
                    onClickReaction={(reaction) => {
                      onReaction(reaction.content)
                    }}
                    trigger={
                      <div className='flex self-center' onClick={() => setAreEmojisVisible(!areEmojisVisible)}><i className="fa-regular fa-face-smile opacity-50"></i></div>
                    }
                  />
                </div>
              </div>
            )}
          </div>
        )
      )}

      <div className="chat-footer flex">
        {reactions?.length > 0 && <div className='p-0.5'>{reactions}{reactions.length}</div>}
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
