import PropTypes from 'prop-types';
import Avatar from '../Avatar/Avatar';
import { editMessage, saveMessage, unsaveMessage } from '../../services/messages.services';
import { useState, useEffect, useContext } from 'react';
import AppContext from '../../context/AuthContext';
import MessageReactions from '../MessageReactions/MessageReactions';
import Linkify from 'react-linkify';
import { db } from '../../config/firebase-config';
import { ref, onValue } from 'firebase/database';

export default function MessageBubble({ message, messageClass, userAvatar, editMessageOption }) {
  const loggedUser = useContext(AppContext);
  const [messageInput, setMessageInput] = useState('');
  const [isEditInputShown, setIsEditInputShown] = useState(false);
  const [areEmojisVisible, setAreEmojisVisible] = useState(false);
  const [reactions, setReactions] = useState(message?.reactions || {});
  const [reactionValues, setReactionValues] = useState([]);
  const isMessageGif = message.content.includes('giphy');
  const isMessageLink = message.content.includes('chat_uploads') || message.content.includes('channel_uploads');
  const isMessageAnImage = message.content.includes('gif') || message.content.includes('jp');
  const timeOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  };
  const isSavedByUser = message.savedBy ? (Object.keys(message.savedBy).find((user) => user === loggedUser?.userData?.handle) ? true : false) : false;

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
        [`${loggedUser.userData?.handle}`]: emoji
      }
      ));
    }
  };

  useEffect(() => {
    editMessage(message.id, { reactions: reactions });

    const messageReactionsRef = ref(db, `messages/${message.id}/reactions`);
      const messageReactionsListener = onValue(messageReactionsRef, (snapshot) => {
        const updatedReactions = snapshot.val();
        if (updatedReactions) {
          setReactionValues(Object.values(updatedReactions));
        }
    });

    return () => {
      messageReactionsListener();
    };
    
  }, [message.id, reactions]);

  // Save msg functionality
  const onSaveItem = () => {
    if (message.id) {
      saveMessage(loggedUser.userData?.handle, message.id);
    }
  }

  // Unsave msg functionality
  const onUnsaveItem = () => {
    if (message.id) {
      unsaveMessage(loggedUser.userData?.handle, message.id);
    }
  }

  return (
    <Linkify>
      <div id='message-wrapper' className={`chat ${messageClass}`} >
        <Avatar user={userAvatar} />
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
              {editMessageOption && !isSavedByUser && <div className='flex self-center pt-0.5 text-xs opacity-50 hover:cursor-pointer p-1' onClick={onSaveItem}><i className="fa-regular fa-bookmark"></i></div>}
              {editMessageOption && isSavedByUser && <div className='flex self-center pt-0.5 text-xs opacity-50 hover:cursor-pointer p-1' onClick={onUnsaveItem}><i className="fa-solid fa-bookmark"></i></div>}
              <img src={message.content} alt="GIF" />
              <div className={`flex flex-row justify-center gap-1 ${!editMessageOption && 'pl-1'}`}>
                {editMessageOption !== true && <MessageReactions
                  areEmojisVisible={areEmojisVisible}
                  setAreEmojisVisible={setAreEmojisVisible}
                  onReaction={onReaction} />
                }
                {!editMessageOption && !isSavedByUser && <div className='flex self-center pt-0.5 text-xs opacity-50 hover:cursor-pointer p-1' onClick={onSaveItem}><i className="fa-regular fa-bookmark"></i></div>}
                {!editMessageOption && isSavedByUser && <div className='flex self-center pt-0.5 text-xs opacity-50 hover:cursor-pointer p-1' onClick={onUnsaveItem}><i className="fa-solid fa-bookmark"></i></div>}
              </div>
            </div>
          ) : (
            isMessageLink === true ? (
              isMessageAnImage === true ? (
                <div className='flex flex-row'>
                  {editMessageOption && !isSavedByUser && <div className='flex self-center pt-0.5 text-xs opacity-50 hover:cursor-pointer p-1' onClick={onSaveItem}><i className="fa-regular fa-bookmark"></i></div>}
                  {editMessageOption && isSavedByUser && <div className='flex self-center pt-0.5 text-xs opacity-50 hover:cursor-pointer p-1' onClick={onUnsaveItem}><i className="fa-solid fa-bookmark"></i></div>}
                  <img src={message.content} alt='Image File Sent' width={200} />
                  <div className='flex flex-row justify-center gap-1'>
                    <div className={`flex flex-row justify-center gap-1 ${!editMessageOption && 'pl-1'}`}>
                      {editMessageOption !== true && <MessageReactions
                        areEmojisVisible={areEmojisVisible}
                        setAreEmojisVisible={setAreEmojisVisible}
                        onReaction={onReaction} />
                      }
                      {!editMessageOption && !isSavedByUser && <div className='flex self-center pt-0.5 text-xs opacity-50 hover:cursor-pointer p-1' onClick={onSaveItem}><i className="fa-regular fa-bookmark"></i></div>}
                      {!editMessageOption && isSavedByUser && <div className='flex self-center pt-0.5 text-xs opacity-50 hover:cursor-pointer p-1' onClick={onUnsaveItem}><i className="fa-solid fa-bookmark"></i></div>}
                    </div>
                  </div>
                </div>
              ) : (
                <div className='flex flex-row'>
                  {editMessageOption && !isSavedByUser && <div className='flex self-center pt-0.5 text-xs opacity-50 hover:cursor-pointer p-1' onClick={onSaveItem}><i className="fa-regular fa-bookmark"></i></div>}
                  {editMessageOption && isSavedByUser && <div className='flex self-center pt-0.5 text-xs opacity-50 hover:cursor-pointer p-1' onClick={onUnsaveItem}><i className="fa-solid fa-bookmark"></i></div>}
                  <div className='flex flex-row w-48 h-20 bg-grey items-center rounded-xl dark:bg-darkAccent'>
                    <i className="fa-regular fa-file fa-xl p-4"></i>
                    <a download target="_blank" rel="noreferrer" href={message.content}>{message?.title?.length > 10 ? message?.title.slice(0, 10) + '...' : message?.title}</a>
                  </div>
                  <div className={`flex flex-row justify-center gap-1 ${!editMessageOption && 'pl-1'}`}>
                    {editMessageOption !== true && <MessageReactions
                      areEmojisVisible={areEmojisVisible}
                      setAreEmojisVisible={setAreEmojisVisible}
                      onReaction={onReaction} />
                    }
                    {!editMessageOption && !isSavedByUser && <div className='flex self-center pt-0.5 text-xs opacity-50 hover:cursor-pointer p-1' onClick={onSaveItem}><i className="fa-regular fa-bookmark"></i></div>}
                    {!editMessageOption && isSavedByUser && <div className='flex self-center pt-0.5 text-xs opacity-50 hover:cursor-pointer p-1' onClick={onUnsaveItem}><i className="fa-solid fa-bookmark"></i></div>}
                  </div>
                </div>
              )
            ) : (
              <div className='flex flex-row'>
                {editMessageOption && !isSavedByUser && <div className='flex self-center pt-0.5 text-xs opacity-50 hover:cursor-pointer p-1' onClick={onSaveItem}><i className="fa-regular fa-bookmark"></i></div>}
                {editMessageOption && isSavedByUser && <div className='flex self-center pt-0.5 text-xs opacity-50 hover:cursor-pointer p-1' onClick={onUnsaveItem}><i className="fa-solid fa-bookmark"></i></div>}
                {editMessageOption && (<div className="flex self-center pt-0.5 text-xs opacity-50 hover:cursor-pointer p-1 pr-2" onClick={handleOpenEditOption}><i className="fa-solid fa-pen-to-square"></i></div>)}
                <div className="px-4 py-2 my-1 rounded-xl bg-grey text-black dark:bg-lightBlue break-words max-w-[220px] sm:max-w-2xl whitespace-normal">
                  <p className='text-left whitespace-normal'>{message.content}</p>
                </div>
                <div className={`flex flex-row justify-center gap-1 ${!editMessageOption && 'pl-1'}`}>
                  {editMessageOption !== true && <MessageReactions
                    areEmojisVisible={areEmojisVisible}
                    setAreEmojisVisible={setAreEmojisVisible}
                    onReaction={onReaction} />
                  }
                  {!editMessageOption && !isSavedByUser && <div className='flex self-center pt-0.5 text-xs opacity-50 hover:cursor-pointer p-1' onClick={onSaveItem}><i className="fa-regular fa-bookmark"></i></div>}
                  {!editMessageOption && isSavedByUser && <div className='flex self-center pt-0.5 text-xs opacity-50 hover:cursor-pointer p-1' onClick={onUnsaveItem}><i className="fa-solid fa-bookmark"></i></div>}
                </div>
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
    </Linkify>
  )
}

MessageBubble.propTypes = {
  message: PropTypes.object,
  messageClass: PropTypes.string,
  userAvatar: PropTypes.string,
  editMessageOption: PropTypes.bool
}
