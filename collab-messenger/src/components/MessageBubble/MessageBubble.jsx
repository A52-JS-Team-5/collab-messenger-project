import PropTypes from 'prop-types';
import Avatar from '../Avatar/Avatar';
import { editMessage } from '../../services/messages.services';
import { useState, useEffect, useContext } from 'react';
import AppContext from '../../context/AuthContext';
import MessageReactions from '../MessageReactions/MessageReactions';

export default function MessageBubble({ message, messageClass, userAvatar, editMessageOption }) {
  const loggedUser = useContext(AppContext);
  const [messageInput, setMessageInput] = useState('');
  const [isEditInputShown, setIsEditInputShown] = useState(false);
  const [areEmojisVisible, setAreEmojisVisible] = useState(false);
  const [reactions, setReactions] = useState(message?.reactions || {});
  const [reactionValues, setReactionValues] = useState([]);
  const isMessageGif = message.content.includes('giphy');   
  const isMessageLink = message.content.includes('chat_uploads');
  const isMessagePdf = message.content.includes('pdf');
  const timeOptions = { 
    year: 'numeric', 
    month: 'numeric', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric',
    hour12: false
  };

  const handleOpenEditOption = () => {
    setIsEditInputShown(!isEditInputShown);
    setMessageInput(message.content);
  };

  const onInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  const setNewMessageContent = () => {
    editMessage(message.id, { content: messageInput });
    setIsEditInputShown(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsEditInputShown(false);
    }

    if (e.key === 'Enter') {
      setNewMessageContent();
    }
  };

  const onReaction = (emoji) => {
    if (!reactions[loggedUser.userData?.handle]) {
      setReactions(prevReactions => ({
        ...prevReactions, 
        [`${loggedUser.userData?.handle}`]: emoji}
      ));
    }
  };

  useEffect(() => {
    editMessage(message.id, { reactions: reactions });
    setReactionValues(Object.values(reactions));
  }, [reactions, message.id]);

  return (
    <div id='message-wrapper' className={`chat ${messageClass}`} >
      <Avatar user={userAvatar}/>
      <div className="chat-header">
        {message.author}
        <time id='message-sent-date' className="text-xs opacity-50 pl-1">{new Date(message.createdOn).toLocaleString('en-GB', timeOptions)}</time>
      </div>

      {isEditInputShown === true ? (
        <div className='flex space-between'>
          <input type="text" value={`${messageInput}`} onChange={onInputChange} onKeyDown={handleKeyDown} className="input input-bordered bg-white border-3 input-md dark:bg-darkAccent" />
          <button className="btn btn-ghost btn-md flex self-center text-black hover:bg-lightBlue dark:text-darkText dark:hover:bg-blue" onClick={setNewMessageContent}>Save</button>
        </div>
      ) : (
        isMessageGif === true ? (
          <div className='flex flex-row'>
            <img src={message.content} alt="GIF" />
            {editMessageOption !== true && <MessageReactions 
              areEmojisVisible={areEmojisVisible} 
              setAreEmojisVisible={setAreEmojisVisible} 
              onReaction={onReaction} />
            }
          </div>
        ) : (
          isMessageLink === true ? (
            isMessagePdf !== true ? (
              <img src={message.content} alt='Image File Sent' width={200} />
            ) : (
              <div className='flex flex-row border w-48 h-20 bg-white items-center rounded-xl dark:bg-darkAccent'>
                <i className="fa-regular fa-file fa-xl p-5"></i>
                <a download target="_blank" rel="noreferrer" href={message.content}>{message.title.length > 10 ? message.title.slice(0, 10) + '...' : message.title}</a>
                {editMessageOption !== true && <MessageReactions 
                  areEmojisVisible={areEmojisVisible} 
                  setAreEmojisVisible={setAreEmojisVisible} 
                  onReaction={onReaction} 
                  isMessageImage={true} />
                }
              </div>
            )
          ) : (
            <div className='flex flex-row'>
              {editMessageOption && (<div className="flex self-center pr-2 pt-0.5 text-xs opacity-50 hover:cursor-pointer pl-2" onClick={handleOpenEditOption}><i className="fa-solid fa-pen-to-square"></i></div>)}
              <div className="px-4 py-2 my-1 rounded-xl bg-grey text-black dark:bg-lightBlue">{message.content}</div>
              {editMessageOption !== true && <MessageReactions
                areEmojisVisible={areEmojisVisible} 
                setAreEmojisVisible={setAreEmojisVisible} 
                onReaction={onReaction} />
              }
            </div>
          )
        )
      )}

      <div id='message-bubble-footer' className="chat-footer relative">
        {reactionValues?.length > 0 && 
          <div className={`dropdown dropdown-hover ${messageClass === 'chat-end' ? 'dropdown-left' : 'dropdown-right'} dropdown-end`}>
            <label tabIndex={0}>{reactionValues}{reactionValues.length}</label>
            <ul tabIndex={0} className="dropdown-content z-[1] menu shadow bg-white dark:bg-darkAccent rounded-box w-28">
              {Object.entries(reactions).map(userReaction => {
                return (<p key={userReaction[0]}>{`${userReaction[1]}:  ${userReaction[0]}`}</p>)
              })}
            </ul>
          </div>
        }
      </div>
    </div>
  )
}

MessageBubble.propTypes = {
  message: PropTypes.object,
  messageClass: PropTypes.string,
  userAvatar: PropTypes.string,
  editMessageOption: PropTypes.bool
}
