import PropTypes from 'prop-types'
import { useContext, useEffect, useState, useRef } from 'react';
import { getMessageById } from '../../services/messages.services';
import AppContext from '../../context/AuthContext';
import MessageBubble from '../MessageBubble/MessageBubble';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MessagesList({ chatMessages }) {
  const [messages, setMessages] = useState([]);
  const loggedUser = useContext(AppContext);
  const endOfMsgsRef = useRef(null);

  useEffect(() => {
    Promise.all(chatMessages.map(message => getMessageById(message)))
      .then(messagesData => {
        setMessages(messagesData);
        if(messagesData.length) {
          endOfMsgsRef.current?.scrollIntoView({
            behavior: "smooth",
          })
        }
      })
      .catch(error => {
        toast('Cannot fetch messages. Please try again later.')
        console.error('Error fetching messages:', error.message);
      });
  }, [chatMessages]);

  return (
    <div className="comments-list overflow-y-auto " >
      {messages.map(message => {
        const messageClass = loggedUser?.userData?.handle === message.author ? 'chat-end' : 'chat-start';
        const userAvatar = loggedUser?.userData?.handle === message.author ? loggedUser?.userData?.handle : message.author;
        const editCommentOption = loggedUser.userData?.handle === message.author;
        
        return (
          <div key={message.id}>
            <MessageBubble message={message} messageClass={messageClass} userAvatar={userAvatar} editCommentOption={editCommentOption} />
          </div>
        )
      })}
      <div ref={endOfMsgsRef} />
    </div>
  );
}

MessagesList.propTypes = {
  chatMessages: PropTypes.array,
}
