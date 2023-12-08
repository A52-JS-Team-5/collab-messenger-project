import { ref, push, get, update } from 'firebase/database';
import { db } from '../config/firebase-config';

export const addMessage = (userHandle, chatId, messageId, message) => {
  const updateMessages = {};
  updateMessages[`/chats/${chatId}/messages/${messageId}`] = true;
  updateMessages[`/users/${userHandle}/messagedPosts/${chatId}`] = true;
  updateMessages[`/chats/${chatId}/lastMessage`] = message;

  return update(ref(db), updateMessages).catch((e) =>
    console.log('Error adding message: ', e.message)
  );
};

export const addMessageChannel = (channelId, messageId, message, userHandle) => {
  const updateChannelMessages = {};
  updateChannelMessages[`/channels/${channelId}/messages/${messageId}`] = true;
  updateChannelMessages[`/channels/${channelId}/lastMessage/`] = message;
  updateChannelMessages[`/users/${userHandle}/messagedChannels/${channelId}`] = true;

  return update(ref(db), updateChannelMessages).catch((e) =>
    console.log(`Error in adding message to channel: ${e.message}`)
  );
};

export const createFileUploadMessage = (
  content,
  userHandle,
  chatId,
  title,
  type
) => {
  const messagesRef = ref(db, 'messages');

  const newMessage = {
    content: content,
    author: userHandle,
    createdOn: Date.now(),
    chatId: chatId,
    reactions: {},
    title: title,
    type: type,
  };

  return push(messagesRef, newMessage)
    .then((newMessageRef) => {
      return newMessageRef.key;
    })
    .catch((error) => {
      console.log(`Error creating message: ${error.message}`);
    });
};

export const createMessage = (content, userHandle, chatId) => {
  const messagesRef = ref(db, 'messages');

  const newMessage = {
    content: content,
    author: userHandle,
    createdOn: Date.now(),
    chatId: chatId,
    reactions: {},
  };

  return push(messagesRef, newMessage)
    .then((newMessageRef) => {
      return newMessageRef.key;
    })
    .catch((error) => {
      console.log(`Error creating message: ${error.message}`);
    });
};

export const createChannelMessage = (content, userHandle, channelId) => {
  const messagesRef = ref(db, 'messages');

  const newMessage = {
    content: content,
    author: userHandle,
    createdOn: Date.now(),
    channelId: channelId,
    reactions: {},
  };

  return push(messagesRef, newMessage)
    .then((newMessageRef) => {
      return newMessageRef.key;
    })
    .catch((error) => {
      console.log(`Error creating channel message: ${error.message}`);
    });
};

export const createFileUploadMessageForChannels = (
  content,
  userHandle,
  channelId,
  title,
  type
) => {
  const messagesRef = ref(db, 'messages');

  const newMessage = {
    content: content,
    author: userHandle,
    createdOn: Date.now(),
    channelId: channelId,
    reactions: {},
    title: title,
    type: type,
  };

  return push(messagesRef, newMessage)
    .then((newMessageRef) => {
      return newMessageRef.key;
    })
    .catch((error) => {
      console.log(`Error creating message: ${error.message}`);
    });
};

export const getMessageById = (messageId) => {
  return get(ref(db, `messages/${messageId}`))
    .then((snapshot) => {
      if (!snapshot.exists()) {
        throw new Error(`Message with id ${messageId} does not exist!`);
      }

      return { ...snapshot.val(), id: messageId };
    })
    .catch((error) => {
      console.error('Error fetching message: ', error);
    });
};

export const editMessage = (messageId, updates) => {
  return update(ref(db, `/messages/${messageId}`), updates).catch((e) => {
    console.log('Error editing comment: ', e.message);
  });
};

export const saveMessage = (handle, msgId) => {
  const updateItems = {};
  updateItems[`/messages/${msgId}/savedBy/${handle}`] = true;
  updateItems[`/users/${handle}/savedMessages/${msgId}`] = true;

  return update(ref(db), updateItems)
    .catch((e) => console.log('Error in saving message', e.message));
};

export const unsaveMessage = (handle, msgId) => {
  const updateItems = {};
  updateItems[`/messages/${msgId}/savedBy/${handle}`] = null;
  updateItems[`/users/${handle}/savedMessages/${msgId}`] = null;

  return update(ref(db), updateItems)
    .catch((e) => console.log('Error in unsaving message', e.message));
};

export const getSavedMessageById = (messageId) => {
  return get(ref(db, `messages/${messageId}`))
    .then((snapshot) => {
      if (!snapshot.exists()) {
        return null;
      }

      return { ...snapshot.val(), id: messageId };
    })
    .catch((error) => {
      console.error('Error fetching message: ', error);
      return null;
    });
};