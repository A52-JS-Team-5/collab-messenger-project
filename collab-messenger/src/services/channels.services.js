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

export const createChannel = (teamId, title, participants, publicStatus) => {
  const channelsRef = ref(db, 'channels');

  const newChannel = {
    title: title,
    participants: {},
    messages: {},
    createdOn: Date.now(),
    isPublic: publicStatus,
    lastMessage: '',
    participantsReadMsg: {},
    team: teamId,
  };

  participants.forEach((participant) => {
    newChannel.participants[`${participant}`] = true;
    newChannel.participantsReadMsg[`${participant}`] = '';
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
    console.log(`Error adding new channel to users' and teams' data: ${e.message}`)
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

      return fromChannelsDocument(snapshot);
    })
    .catch((e) => console.log(`Error in getting all channels: ${e.message}`));
};

export const userChannelsDocument = (snapshots) => {
  return snapshots.map((snapshot) => {
    if (!snapshot) {
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
  return get(ref(db, `users/${userHandle}/channels`))
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
    remove(ref(db, `/channels/${channelId}/participantsReadMsg/${userHandle}`))
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

export const getChannelByTitle = (title) => {
  return get(
    query(ref(db, 'channels'), orderByChild('title'), equalTo(title))
  ).catch((e) => console.log(`Error in getting channel by title: ${e.message}`));
};

export const getChannelsByTeamId = (teamId) => {
  return get(query(ref(db, 'channels'), orderByChild('team'), equalTo(teamId)))
    .catch(e => console.log('Error in getting channels by team id: ', e.message));
};

export const deleteChannel = (channelData) => {
  return Promise.all([
    Object.keys(channelData.participants).forEach((user) => {
      return remove(ref(db, `/users/${user}/channels/${channelData.id}`));
    }),
    Object.keys(channelData.messages).forEach((message) => {
      return remove(ref(db, `/messages/${message}`));
    }),
    remove(ref(db, `/teams/${channelData.team}/channels/${channelData.id}`)),
    remove(ref(db, `/channels/${channelData.id}`)),
  ]).catch((e) => console.log('Error in deleting channel: ', e.message));
};

export const updateChannelFiles = (channelId, fileUrl) => {
  const updateChannel = {};
  updateChannel[`/channels/${channelId}/uploadedFiles/url`] = fileUrl;

  return update(ref(db), updateChannel).catch((e) =>
    console.log(`Error in updating channels' uploaded files: `, e.message)
  );
};

export const updateChannelTitle = (channelId, newTitle) => {
  const updates = {};
  updates[`/channels/${channelId}/title`] = newTitle;

  return update(ref(db), updates).catch((e) =>
    console.log('Error changing channel title: ', e.message)
  );
};

export const updateChannelParticipants = (channelId, participants) => {
  const updates = {};

  participants.forEach((participant) => {
    updates[`/channels/${channelId}/participants/${participant.value}`] = true;
    updates[`/channels/${channelId}/participantsReadMsg/${participant.value}`] = "";
    updates[`/users/${participant.value}/channels/${channelId}`] = true;
  });

  return update(ref(db), updates).catch((e) =>
    console.log('Error adding channel participants: ', e.message)
  );
};

export const addNewTeamMembersToPublicChannels = (teamChannels, membersToAdd) => {
  const channelRefs = teamChannels.map((channelId) =>
    get(ref(db, `channels/${channelId}`))
  );
  
  Promise.all(channelRefs)
    .then((channelsSnapshots) => {
      if (channelsSnapshots.length === 0) {
        return [];
      }

      return userChannelsDocument(channelsSnapshots);
    })
    .then((channelsData) => {
      const publicChannels = channelsData.filter(channel => channel.isPublic === true);
      publicChannels.forEach(ch => {
        const updates = {};

        membersToAdd.forEach((participant) => {
          updates[`/channels/${ch.id}/participants/${participant}`] = true;
          updates[`/users/${participant}/channels/${ch.id}`] = true;
          updates[`/channels/${ch.id}/participantsReadMsg/${participant}`] = "";
        });
      
        return update(ref(db), updates);
      })
    })
    .catch((e) =>
      console.log(`Error in adding new team members to public channels of team: ${e.message}`)
    );
};
