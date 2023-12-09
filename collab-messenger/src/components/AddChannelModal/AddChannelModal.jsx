import { useState, useContext, useRef } from "react";
import cn from 'classnames'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addChannel, createChannel, getChannelsByTeamId } from "../../services/channels.services";
import { searchUsers } from '../../services/users.services';
import PropTypes from "prop-types";
import AppContext from '../../context/AuthContext';
import { createNotification, pushNotifications } from "../../services/notifications.services";
import { CREATED_PUBLIC_CHANNEL_NOTIFICATION, CREATED_PRIVATE_CHANNEL_NOTIFICATION, CREATED_CHANNEL_TYPE, MAX_CHANNEL_NAME_LENGTH, MIN_CHANNEL_NAME_LENGTH, ZERO } from "../../common/constants";

export default function AddChannelModal({ teamId, teamParticipants, teamOwner, isOpen, onClose, teamName }) {
  const user = useContext(AppContext);
  const [teamChannelTitle, setTeamChannelTitle] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [channelType, setChannelType] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const inputRef = useRef();

  const modalClass = cn({
    "modal modal-bottom sm:modal-middle": true,
    "modal-open": isOpen,
  });

  const [channelData, setChannelData] = useState({
    title: '',
    members: {},
});

  const navigate = useNavigate();

  const handleSelectChange = (e) => {
    setChannelType(e.target.value);
  }

  const handleSearchUsers = (query) => {
    if (query.trim() !== "") {
        searchUsers(query)
            .then((filteredUsers) => {
              const selectedUsers = filteredUsers.filter(user => teamParticipants.includes(user.handle) && !channelData.members[user.id]);
              setSearchResults(selectedUsers);
            })
            .catch((error) => {
                console.error(error.message);
            });
    } else {
        setSearchResults([]);
    }
  };

  const handleAddMember = (userId) => {
    const userToAdd = searchResults.find((user) => user.id === userId);

    if (userToAdd) {
        setChannelData({
            ...channelData,
            members: {
                ...channelData.members,
                [userToAdd.handle]: userToAdd.name,
            },
        });

        setSelectedMembers([...selectedMembers, userToAdd]);
        inputRef.current.value = '';
        handleSearchUsers('');
    }
  };

  const handleRemoveMember = (handle) => {
    const updatedMembers = { ...channelData.members };
    delete updatedMembers[handle];

    const updatedSelectedMembers = selectedMembers.filter((member) => member.handle !== handle);

    setChannelData({
        ...channelData,
        members: updatedMembers,
    });

    setSelectedMembers(updatedSelectedMembers);
  };

  const handleTeamChannelCreation = (e) => {
    e.preventDefault();

    if(!teamChannelTitle) {
      toast('You must include a title for the channel!');
      return;
    } else if (teamChannelTitle.length < MIN_CHANNEL_NAME_LENGTH || teamChannelTitle > MAX_CHANNEL_NAME_LENGTH) {
      toast(`Channel title must be between ${MIN_CHANNEL_NAME_LENGTH} and ${MAX_CHANNEL_NAME_LENGTH} characters.`);
      return;
    }

    getChannelsByTeamId(teamId)
      .then((snapshot) => {
        const teamChannels = Object.values(snapshot.val());
        if (teamChannels.filter((teamChannel) => teamChannel.title === teamChannelTitle).length > ZERO) {
          toast(`Channel title "${teamChannelTitle}" is already taken. Please choose a different title.`);
          return;
        } else {
          if (channelType === 'Private') {
            const membersToAdd = [...selectedMembers.map((member) => member.handle), user.userData.handle];
            createChannel(teamId, teamChannelTitle, membersToAdd)
              .then((channelId) => {
                addChannel(teamParticipants, channelId, teamId, teamOwner)
                return channelId;
              })
              .then((channelId) => {
                navigate(`/app/teams/${teamId}/${channelId}`);
              })
              .then(() => {
                return createNotification(`${CREATED_PRIVATE_CHANNEL_NOTIFICATION}: ${teamChannelTitle} in ${teamName}`, CREATED_CHANNEL_TYPE)
              })
              .then((notificationId) => {
                Promise.all(teamParticipants.map((member) => {
                  pushNotifications(member, notificationId)
                }))
              })
              .catch((e) => {
                console.log(`Error creating a new channel: ${e.message}`);
              })
              
              onClose();
      
          } else {
            createChannel(teamId, teamChannelTitle, teamParticipants)
              .then((channelId) => {
                addChannel(teamParticipants, channelId, teamId, teamOwner)
                return channelId;
              })
              .then((channelId) => {
                navigate(`/app/teams/${teamId}/${channelId}`);
              })
              .then(() => {
                return createNotification(`${CREATED_PUBLIC_CHANNEL_NOTIFICATION}: ${teamChannelTitle} in ${teamName}`, CREATED_CHANNEL_TYPE)
              })
              .then((notificationId) => {
                Promise.all(teamParticipants.map((member) => {
                  pushNotifications(member, notificationId)
                }))
              })
              .catch((e) => {
                console.log(`Error creating a new channel: ${e.message}`);
              })
        
              onClose();
          }
        }
      })
  }

  return (
    <div className="start-chat-view">
      <div className={modalClass}>
        <div className="modal-box bg-pureWhite dark:bg-darkFront">
          <div className="post-description flex flex-col gap-2">
            <h3 className="font-semibold leading-7 text-gray-900 dark:text-darkText">Create A Channel</h3>
            <div>
              <label className="label">
                <span className="label-text text-black bg-transparent dark:text-darkText">Channel Title</span>
              </label>
              <input type="text" defaultValue={teamChannelTitle} onChange={(e) => {setTeamChannelTitle(e.target.value)}} className="input input-bordered w-full text-black bg-white dark:bg-darkInput dark:text-darkText" />
              <select className="select select-bordered w-full text-black bg-white dark:bg-darkInput dark:text-darkText mt-4" onChange={handleSelectChange} defaultValue='default'>
                <option disabled value='default'>Select Channel Type</option>
                <option>Public</option>
                <option>Private</option>
              </select>
              {channelType === 'Private' ? (
                <div className="flex flex-col gap-2">
                  <div>
                    <label className="label">
                        <span className="label-text">Members</span>
                    </label>
                    <div className="scrollable-list-container flex flex-col gap-2">
                      <input type="text" ref={inputRef} onChange={(e) => {
                          handleSearchUsers(e.target.value);
                      }}
                          className="input input-bordered w-full text-black bg-white dark:bg-darkInput dark:text-darkText"
                      />
                      {/* Display search results */}
                      {searchResults.length > 0 && (
                          <ul className="scrollable-list max-h-24	overflow-y-auto">
                              {searchResults.map((user) => (
                                  <li key={user.id} onClick={() => handleAddMember(user.id)} className='cursor-pointer flex flex-row gap-2 items-center hover:bg-pureWhite pt-1 pb-1 pl-2 pr-2 dark:hover:bg-darkAccent dark:text-darkText'>
                                      <img src={user.photoURL} className='h-8 w-8 rounded-full' />
                                      <div className='flex flex-col items-start'>
                                          <p className='text-sm'>{user.name}{' '}{user.surname}</p>
                                          <p className='text-xs'>{`@${user.id}`}</p>
                                      </div>
                                  </li>
                              ))}
                          </ul>
                      )}
                    </div>
                  </div>
                    {/* Display selected members */}
                    {selectedMembers.length > 0 && (
                    <div className="selected-members">
                        <ul className='flex flex-wrap gap-2'>
                            {selectedMembers.map((member) => (
                                <li key={member.id} className='badge badge-outline gap-2 p-4'>
                                    <img src={member.photoURL} className='h-4 w-4 rounded-full' />
                                    {member.name}{' '}{member.surname}
                                    <i className="fa-solid fa-x cursor-pointer" onClick={() => handleRemoveMember(member.handle)}></i>
                                </li>
                            ))}
                        </ul>
                    </div>
                    )}
                  </div>
              ) : (null) }
            </div>
          </div>
          <div className="modal-action flex-row">
            <button className="btn btn-outline text-pink bg-transparent" onClick={onClose}>Cancel</button>
            <button type="button" onClick={handleTeamChannelCreation} className="btn border-none bg-pink text-white">Create Channel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

AddChannelModal.propTypes = {
  teamId: PropTypes.string,
  teamParticipants: PropTypes.array,
  teamOwner: PropTypes.string,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  teamName: PropTypes.string,
}