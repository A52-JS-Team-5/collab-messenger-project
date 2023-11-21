import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { db } from '../config/firebase-config';
import { getAuth } from 'firebase/auth';
import { ZERO } from '../common/constants';

export const getUserByHandle = (handle) => {
  return get(ref(db, `users/${handle}`))
    .catch((e) => console.log('Error in getting user', e.message));
};

export const createUserHandle = (handle, uid, email, name, surname, phoneNumber) => {

  return set(ref(db, `users/${handle}`), {
    handle,
    uid,
    email,
    name,
    surname,
    phoneNumber,
    photoURL: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg',
    teamsOwner: [],
    teamsMember: [],
    channels: [],
    chats: [],
    messages: [],
    status: 'online',
    createdOn: Date.now(),
  })
  .catch(e => console.log(e.message))
};

export const getUserData = (uid) => {
  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)))
    .catch((e) => console.log('Error in getting user data', e.message));
};

export const getUsersCount = () => {

  return get(ref(db, `users`))
    .then(snapshot => {
      if (snapshot.exists()) {
        const allUsers = snapshot.val();
        return Object.keys(allUsers).length;
      } else {
        return ZERO;
      }
    })
    .catch(e => console.log(e.message));
}

const fromUsersDocument = (snapshot) => {
  const usersDocument = snapshot.val();

  return Object.keys(usersDocument).map((key) => {
    const user = usersDocument[key];

    return {
      id: key,
      name: user.name,
      surname: user.surname,
      email: user.email,
      handle: user.handle,
      createdOn: new Date(user.createdOn).toLocaleDateString(),
      isAdmin: user.isAdmin,
      likedPosts: user.likedPosts ? Object.keys(user.likedPosts) : [],
      commentedPost: user.comments ? Object.keys(user.commentedPost) : [],
      isBlocked: user.isBlocked
    };
  });
};

export const getAllUsers = () => {
  return get(ref(db, `users`))
    .then(snapshot => {
      if (!snapshot.exists()) {
        return [];
      }

      return fromUsersDocument(snapshot);
    })
    .catch(e => console.log(e.message));
}

export const getCurrentUserUid = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    return user.uid;
  } else {
    throw new Error('No user is logged in')
  }
}

export const getUsernameByUid = (uid) => {
  // Query the "users" collection to find a user with a matching "uid" property
  const userQuery = query(ref(db, 'users'), orderByChild('uid'), equalTo(uid));

  return get(userQuery)
    .then((snapshot) => {
      if (snapshot.exists()) {
        // There should be only one matching user, so we take the first one
        const userKey = Object.keys(snapshot.val())[0];
        const userData = snapshot.val()[userKey];
        return userData.handle; // This retrieves the user's username.
      } else {
        throw new Error('User not found for the provided UID');
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
};

export const checkEmailExists = (email) => {
  return get(ref(db, 'users'))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const emailExists = Object.values(snapshot.val()).some((user) => user.email === email);
        return emailExists;
      }
      return false; // Database is empty; the email doesn't exist
    })
    .catch(e => console.log(e.message));
};

export const changeAdminStatus = (userHandle, currentStatus) => {
  const updates = { isAdmin: !currentStatus };
  update(ref(db, `users/${userHandle}`), updates)
    .catch((e) => console.log('Error in changing admin status', e.message)); 
}

export const changeBlockedStatus = (userHandle, currentStatus) => {
  const updates = { isBlocked: !currentStatus };
  update(ref(db, `users/${userHandle}`), updates)
    .catch((e) => console.log('Error in changing blocked status', e.message));
}

export const editUserProfile = (handle, updates) => {
  return update(ref(db, `users/${handle}`), updates)
    .then(() => {
      return 'Successful update';
    })
    .catch(e => console.log(e.message))
}

// Sorting of users
function ascendingSort(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}

function descendingSort(a, b) {
  if (a.name > b.name) {
    return -1;
  }
  if (a.name < b.name) {
    return 1;
  }
  return 0;
}

function ascendingDateSort(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.createdOn > b.createdOn) {
    return 1;
  }
  return 0;
}

function descendingDateSort(a, b) {
  if (a.createdOn > b.createdOn) {
    return -1;
  }
  if (a.createdOn < b.createdOn) {
    return 1;
  }
  return 0;
}

export const sortNamesFromAToZ = (allUsers) => [...allUsers].sort(ascendingSort);

export const sortNamesFromZToA = (allUsers) => [...allUsers].sort(descendingSort);

export const sortUsersByDate = (allUsers) => [...allUsers].sort(ascendingDateSort);

export const sortUsersByDateDesc = (allUsers) => [...allUsers].sort(descendingDateSort);
