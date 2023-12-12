import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { db } from '../config/firebase-config';
import { getAuth } from 'firebase/auth';
import { ZERO } from '../common/constants';
import { DEFAULT_USER_PHOTO } from '../common/constants';

export const getUserByHandle = (handle) => {
  return get(ref(db, `users/${handle}`))
    .then((snapshot) => {
      return snapshot.val();
    })
    .catch((e) => console.log('Error in getting user by handle: ', e.message));
};

export const createUserHandle = (handle, uid, email, name, surname, phoneNumber) => {
  return set(ref(db, `users/${handle}`), {
    handle,
    uid,
    email,
    name,
    surname,
    phoneNumber,
    photoURL:  DEFAULT_USER_PHOTO,
    teamsOwner: [],
    teamsMember: [],
    channels: [],
    chats: [],
    messages: [],
    status: 'Online',
    createdOn: Date.now(),
  })
    .catch(e => console.log('Error in creating user: ', e.message))
};

export const getUserData = (uid) => {
  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)))
    .catch((e) => console.log('Error in getting user data: ', e.message));
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
    .catch(e => console.log('Error in getting users count:', e.message));
};

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
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      teamsOwner: user.teamsOwner ? Object.keys(user.teamsOwner) : [],
      teamsMember: user.teamsMember ? Object.keys(user.teamsMember) : [],
      channels: user.channels ? Object.keys(user.channels) : [],
      chats: user.chats ? Object.keys(user.chats) : [],
      messages: user.messages ? Object.keys(user.messages) : [],
      status: user.status,
      bio: user.bio ? user.bio : '',
      notifications: user.notifications ? Object.keys(user.notifications) : [],
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
    .catch(e => console.log('Error in getting all users: ', e.message));
};

export const getCurrentUserUid = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    return user.uid;
  } else {
    throw new Error('No user is logged in')
  }
};

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
      console.log('Error in getting username by UID', error.message);
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
    .catch(e => console.log('Error in checking if email exists in database: ', e.message));
};

export const changeStatus = (userHandle, newStatus) => {
  return update(ref(db, `users/${userHandle}`), { status: newStatus })
    .catch((e) => console.log('Error in changing status:', e.message));
};

export const editUserProfile = (handle, updates) => {
  return update(ref(db, `users/${handle}`), updates)
    .then(() => {
      return 'Successful update';
    })
    .catch(e => console.log('Error in editing user profile: ', e.message))
};

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

export const searchUsers = (query) => {
  if (query !== '') {
    return new Promise((resolve, reject) => {
      // Fetch all users from the database
      getAllUsers()
        .then((allUsers) => {
          // Filter users based on the search query
          const filteredUsers = allUsers.filter(
            (user) =>
              user.name.toLowerCase().includes(query.toLowerCase()) ||
              user.surname.toLowerCase().includes(query.toLowerCase()) ||
              user.handle.toLowerCase().includes(query.toLowerCase()) ||
              user.email.toLowerCase().includes(query.toLowerCase())
          );

          resolve(filteredUsers);
        })
        .catch((error) => {
          reject(new Error('Error fetching users from the database: ' + error.message));
        });
    });
  }
};
