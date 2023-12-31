import { ref, push, get, query, update, remove } from 'firebase/database';
import { db } from '../config/firebase-config';
import { ZERO } from '../common/constants';

export const updateChatFiles = (chatId, fileUrl) => {
  const updateChat = {};
  updateChat[`/chats/${chatId}/uploadedFiles/url`] = fileUrl;

  return update(ref(db), updateChat).catch((e) =>
    console.log(`Error in updating uploaded files in chat: ${e.message}`)
  );
};

export const getChatsCount = () => {
  return get(ref(db, `chats`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const allChats = snapshot.val();
        return Object.keys(allChats).length;
      } else {
        return ZERO;
      }
    })
    .catch((e) => console.log('Error in getting chats count', e.message));
};

export const createChat = (...participants) => {
  const chatsRef = ref(db, 'chats');

  const newChat = {
    participants: {},
    messages: {},
    createdOn: Date.now(),
    isGroup: false,
    lastMessage: '',
    participantsReadMsg: {},
  };

  participants.forEach((participant) => {
    newChat.participants[`${participant}`] = true;
    newChat.participantsReadMsg[`${participant}`] = '';
  });

  return push(chatsRef, newChat)
    .then((newChatRef) => {
      return newChatRef.key;
    })
    .catch((error) => {
      console.log(`Error in creating chat: ${error.message}`);
    });
};

export const addChat = (userHandle, loggedUserHandle, chatId) => {
  const updateChats = {};
  updateChats[`/users/${userHandle}/chats/${chatId}`] = true;
  updateChats[`/users/${loggedUserHandle}/chats/${chatId}`] = true;
  updateChats[`/users/${userHandle}/chatParticipants/${loggedUserHandle}`] =
    chatId;
  updateChats[`/users/${loggedUserHandle}/chatParticipants/${userHandle}`] =
    chatId;

  return update(ref(db), updateChats).catch((e) =>
    console.log(`Error in adding chat to users' data`, e.message)
  );
};

const fromChatsDocument = (snapshot) => {
  const chatsDocument = snapshot.val();

  return Object.keys(chatsDocument).map((key) => {
    const chat = chatsDocument[key];

    return {
      id: key,
      title: chat.title,
      participants: chat.participants ? Object.keys(chat.participants) : [],
      messages: chat.messages ? Object.keys(chat.messages) : [],
      lastMessage: chat.lastMessage,
      participantsReadMsg: chat.participantsReadMsg
        ? chat.participantsReadMsg
        : {},
    };
  });
};

export const getAllChats = () => {
  return get(ref(db, 'chats'))
    .then((snapshot) => {
      if (!snapshot.exists()) {
        return [];
      }
      console.log(snapshot);
      return fromChatsDocument(snapshot);
    })
    .catch((e) => console.log('Error in getting all chats: ', e.message));
};

const userChatsDocument = (snapshots) => {
  return snapshots.map((snapshot) => {
    if (!snapshot || !snapshot.val) {
      throw new Error('Invalid snapshot:', snapshot);
    }

    const chat = snapshot.val();
    return {
      id: snapshot.key,
      createdOn: chat.createdOn,
      isGroup: chat.isGroup,
      participants: chat.participants ? Object.keys(chat.participants) : [],
      messages: chat.messages ? Object.keys(chat.messages) : [],
      lastMessage: chat.lastMessage,
      participantsReadMsg: chat.participantsReadMsg,
    };
  });
};

export const getLoggedUserChats = (userHandle) => {
  return get(query(ref(db, `users/${userHandle}/chats`)))
    .then((snapshot) => {
      if (!snapshot.exists()) {
        return [];
      }
      const chatIds = Object.keys(snapshot.val());
      const chatRefs = chatIds.map((chatId) => get(ref(db, `chats/${chatId}`)));

      return Promise.all(chatRefs);
    })
    .then((chatsSnapshots) => {
      if (chatsSnapshots.length === 0) {
        return [];
      }
      return userChatsDocument(chatsSnapshots);
    })
    .catch((e) =>
      console.log('Error in getting chats of logged user: ', e.message)
    );
};

export const createGroupChat = (title, participants) => {
  const chatsRef = ref(db, 'chats');
  const newChat = {
    title: title,
    participants: {},
    messages: {},
    createdOn: Date.now(),
    isGroup: true,
    lastMessage: '',
    participantsReadMsg: {},
  };

  participants.forEach((participant) => {
    newChat.participants[`${participant.value}`] = true;
    newChat.participantsReadMsg[`${participant.value}`] = '';
  });

  return push(chatsRef, newChat)
    .then((newChatRef) => {
      return newChatRef.key;
    })
    .catch((error) => {
      console.log(`Error in creating group chat: ${error.message}`);
    });
};

export const addGroupChat = (chatId, participants) => {
  const updateChats = {};
  participants.forEach((participant) => {
    return (updateChats[`/users/${participant.value}/chats/${chatId}`] = true);
  });

  return update(ref(db), updateChats).catch((e) =>
    console.log(`Error in adding group chat to users' data`, e.message)
  );
};

export const updateGroupChatParticipants = (chatId, participants) => {
  const updates = {};

  participants.forEach((participant) => {
    updates[`/chats/${chatId}/participants/${participant.value}`] = true;
    updates[`/users/${participant.value}/chats/${chatId}`] = true;
  });

  return update(ref(db), updates)
    .catch((e) => console.log('Error in adding group chat participants: ', e.message));
}

export const updateGroupChatTitle = (chatId, newTitle) => {
  const updates = {};
  updates[`/chats/${chatId}/title`] = newTitle;

  return update(ref(db), updates)
    .catch((e) => console.log('Error in changing group chat title: ', e.message));
}

export const leaveChat = (chatId, userHandle) => {
  return Promise.all([
    remove(ref(db, `/users/${userHandle}/chats/${chatId}`)),
    remove(ref(db, `chats/${chatId}/participants/${userHandle}`)),
    remove(ref(db, `chats/${chatId}/participantsReadMsg/${userHandle}`)),
  ]).catch((e) => console.log('Error in leaving chat', e.message));
};

export function ascendingSort(a, b) {
  if (a.title < b.title) {
    return -1;
  }
  if (a.title > b.title) {
    return 1;
  }
  return 0;
}

export function descendingSort(a, b) {
  if (a.title > b.title) {
    return -1;
  }
  if (a.title < b.title) {
    return 1;
  }
  return 0;
}

export function ascendingDateSort(a, b) {
  if (a.createdOn < b.createdOn) {
    return -1;
  }
  if (a.createdOn > b.createdOn) {
    return 1;
  }
  return 0;
}

export function descendingDateSort(a, b) {
  if (a.createdOn > b.createdOn) {
    return -1;
  }
  if (a.createdOn < b.createdOn) {
    return 1;
  }
  return 0;
}

export const sortFromAToZ = (allChats) => [...allChats].sort(ascendingSort);

export const sortFromZToA = (allChats) => [...allChats].sort(descendingSort);

export const sortByDate = (allChats) => [...allChats].sort(ascendingDateSort);

export const sortByDateDesc = (allChats) =>
  [...allChats].sort(descendingDateSort);

export const getChatById = (id) => {
  return get(ref(db, `chats/${id}`))
    .then((result) => {
      if (!result.exists()) {
        throw new Error(`Chat with id ${id} does not exist!`);
      }
      const chat = result.val();

      if (!chat.participants) chat.participants = {};
      if (!chat.participansLastReadMessages)
        chat.participansLastReadMessages = {};
      if (!chat.messages) chat.messages = {};
      return chat;
    })
    .catch((e) => console.log('Error in getting chat by ID: ', e.message));
};
