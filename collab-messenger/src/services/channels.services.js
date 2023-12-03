import {
  ref,
  get,
  push,
  update,
  query,
  remove,
  orderByChild,
  equalTo,
} from 'firebase/database';
import { db } from '../config/firebase-config';
import { ZERO } from '../common/constants';
import {
  ascendingSort,
  descendingSort,
  ascendingDateSort,
  descendingDateSort,
} from './chats.services';

export const getChannelsCount = () => {
  return get(ref(db, 'channels'))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const allChannels = snapshot.val();
        return Object.keys(allChannels).length;
      } else {
        return ZERO;
      }
    })
    .catch((e) => console.log(`Error getting channels count: ${e.message}`));
};

export const createChannel = (title, participants) => {
  const channelsRef = ref(db, 'channels');

  const newChannel = {
    title: title,
    participants: {},
    messages: {},
    createdOn: Date.now(),
    isPublic: false,
    lastMessage: '',
    participantsReadMsg: {},
  };

  participants.forEach((participant) => {
    newChannel.participants[`${participant}`] = true;
  });

  return push(channelsRef, newChannel)
    .then((newChannelRef) => {
      return newChannelRef.key;
    })
    .catch((e) => {
      console.log(`Error creating channel: ${e.message}`);
    });
};

export const addChannel = (participants, channelId, teamId, teamOwner) => {
  const updateChannels = {};

  participants.forEach((participant) => {
    updateChannels[`/users/${participant}/channels/${channelId}`] = true;
  });

  updateChannels[`/teams/${teamId}/channels/${channelId}`] = true;
  updateChannels[`/users/${teamOwner}/channels/${channelId}`] = true;

  return update(ref(db), updateChannels).catch((e) =>
    console.log(`Error adding channel to users' data: ${e.message}`)
  );
};

const fromChannelsDocument = (snapshot) => {
  const channelsDocument = snapshot.val();

  return Object.keys(channelsDocument).map((key) => {
    const channel = channelsDocument[key];

    return {
      id: key,
      title: channel.title,
      participants: channel.participants
        ? Object.keys(channel.participants)
        : [],
      messages: channel.messages ? Object.keys(channel.messages) : [],
      lastMessage: channel.lastMessage,
      participantsReadMsg: channel.participantsReadMsg
        ? channel.participantsReadMsg
        : {},
    };
  });
};

export const getAllChannels = () => {
  return get(ref(db, 'channels'))
    .then((snapshot) => {
      if (!snapshot.exists()) {
        return [];
      }
      console.log(snapshot);
      return fromChannelsDocument(snapshot);
    })
    .catch((e) => console.log(`Error in getting all channels: ${e.message}`));
};

export const userChannelsDocument = (snapshots) => {
  return snapshots.map((snapshot) => {
    if (!snapshot || snapshot.val) {
      throw new Error(`Invalid snapshot: ${snapshot}`);
    }

    const channel = snapshot.val();
    return {
      id: snapshot.key,
      title: channel.title,
      createdOn: channel.createdOn,
      isPublic: channel.isPublic,
      participants: channel.participants
        ? Object.keys(channel.participants)
        : [],
      messages: channel.messages ? Object.keys(channel.messages) : [],
      lastMessage: channel.lastMessage,
      participantsReadMsg: channel.participantsReadMsg,
    };
  });
};

export const getLoggedUserChannels = (userHandle) => {
  return get(query(ref(db, `users/${userHandle}/channels`)))
    .then((snapshot) => {
      if (!snapshot.exists()) {
        return [];
      }

      const channelIds = Object.keys(snapshot.val());
      const channelRefs = channelIds.map((channelId) =>
        get(ref(db, `channels/${channelId}`))
      );

      return Promise.all(channelRefs);
    })
    .then((channelsSnapshots) => {
      if (channelsSnapshots.length === 0) {
        return [];
      }
      return userChannelsDocument(channelsSnapshots);
    })
    .catch((e) =>
      console.log(`Error in getting channels of logged user: ${e.message}`)
    );
};

export const leaveChannel = (channelId, userHandle) => {
  return Promise.all([
    remove(ref(db, `/users/${userHandle}/channels/${channelId}`)),
    remove(ref(db, `/channels/${channelId}/participants/${userHandle}`)),
  ]).catch((e) => console.log(`Error in leaving channel: ${e.message}`));
};

export const sortFromAToZChannels = (allChannels) =>
  [...allChannels].sort(ascendingSort);

export const sortFromZToAChannels = (allChannels) =>
  [...allChannels].sort(descendingSort);

export const sortByDateChannels = (allChannels) =>
  [...allChannels].sort(ascendingDateSort);

export const sortByDateDescChannels = (allChannels) => {
  [...allChannels].sort(descendingDateSort);
};

export const getChannelById = (id) => {
  return get(ref(db, `channels/${id}`))
    .then((result) => {
      if (!result.exists()) {
        throw new Error(`Channel with id ${id} does not exist!`);
      }

      const channel = result.val();

      if (!channel.participants) channel.participants = {};
      if (!channel.messages) channel.messages = {};
      return channel;
    })
    .catch((e) => console.log(`Error in getting channel by Id: ${e.message}`));
};

export const makeChannelPublic = (id) => {
  return update(ref(db, `channels/${id}`), {
    isPublic: true,
  }).catch((e) => console.log(`Error in making channel public: ${e.message}`));
};

// this doesn't work because in channels we don't have team name
export const getChannelByName = (name) => {
  return get(
    query(ref(db, 'channels'), orderByChild('name'), equalTo(name))
  ).catch((e) => console.log(`Error in getting channel: ${e.message}`));
};
