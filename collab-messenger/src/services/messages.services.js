import {
  ref,
  push,
  get,
  update,
} from 'firebase/database';
import { db } from '../config/firebase-config';

export const addMessage = (userHandle, chatId, messageId, message) => {
  const updateMessages = {};
  updateMessages[`/chats/${chatId}/messages/${messageId}`] = true;
  updateMessages[`/users/${userHandle}/messagedPosts/${chatId}`] = true;
  updateMessages[`/chats/${chatId}/lastMessage`] = message;

  return update(ref(db), updateMessages)
    .catch((e) => console.log('Error adding message: ', e.message));
};

export const createFileUploadMessage = (content, userHandle, chatId, title, type, ) => {
  const messagesRef = ref(db, 'messages');

  const newMessage = {
    content: content,
    author: userHandle,
    createdOn: Date.now(),
    chatId: chatId,
    reactions: {},
    title: title,
    type: type
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
    reactions: {}
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
  return update(ref(db, `/messages/${messageId}`), updates)
    .catch((e) => {
      console.log('Error editing comment: ', e.message);
    });
};

// const commentAscDateSort = (a, b) => {
//   if (a.createdOn < b.createdOn) {
//     return -1;
//   }

//   if (a.createdOn > b.createdOn) {
//     return 1;
//   }

//   return 0;
// };

// const commentDescDateSort = (a, b) => {
//   if (a.createdOn > b.createdOn) {
//     return -1;
//   }

//   if (a.createdOn < b.createdOn) {
//     return 1;
//   }

//   return 0;
// };

// export const commentSortByDateAsc = (allComments) =>
//   [...allComments].sort(commentAscDateSort);

// export const commentSortByDateDesc = (allComments) =>
//   [...allComments].sort(commentDescDateSort);

// export const deleteComment = (commentId, postId, userHandle) => {
//   return Promise.all([
//     remove(ref(db, `comments/${commentId}`)),
//     remove(ref(db, `posts/${postId}/comments/${commentId}`)),
//     remove(ref(db, `posts/${postId}/commentedBy/${userHandle}`)),
//     remove(ref(db, `${userHandle}/commentedPost/${postId}`))
//   ])
//   .catch((e) => console.log('Error in deleting comment', e.message));
// };

// export const getCommentsByPost = (postId) => {
//   return get(query(ref(db, `posts/${postId}/comments`)))
//     .then((snapshot) => {
//       if (!snapshot.exists()) return [];

//       return Object.keys(snapshot.val());
//     })
//     .catch((e) => console.log('Error getting comments by post', e.message));
// };

// const fromCommentsDocument = (snapshot) => {
//   const commentsDocument = snapshot.val();

//   return Object.keys(commentsDocument).map((key) => {
//     const comment = commentsDocument[key];

//     return {
//       id: key,
//       description: comment.description,
//       author: comment.author,
//       createdOn: new Date(comment.createdOn),
//       postId: comment.postId,
//     };
//   });
// };

// export const getAllComments = () => {
//   return get(ref(db, 'comments'))
//     .then((snapshot) => {
//       if (!snapshot.exists()) {
//         return [];
//       }

//       return fromCommentsDocument(snapshot);
//     })
//     .catch((e) => console.log('Error in getting all comments', e.message));
// };

// export const getCommentsByAuthor = (handle) => {
//   return get(query(ref(db, 'comments'), orderByChild('author'), equalTo(handle)))
//     .then((snapshot) => {
//       if (!snapshot.exists()) {
//         return [];
//       }

//       return fromCommentsDocument(snapshot);
//     })
//     .catch((e) => console.log('Error in getting comments by author', e.message));
// };
