import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteChannel, getChannelById } from '../../services/channels.services';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddChannelModal from '../AddChannelModal/AddChannelModal';

export default function ChannelsList({ teamDetails }) {
  const navigate = useNavigate();
  const [allChannels, setAllChannels] = useState([]);
  const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);

  const openCreateChannelModal = () => {
    setIsCreateChannelModalOpen(true);
  };

  const closeCreateChannelModal = () => {
    setIsCreateChannelModalOpen(false);
  };

  useEffect(() => {
    const getChannelDetails = () => {
      if (teamDetails.channels) {
        const channelPromises = teamDetails.channels.map((channelId) =>
          getChannelById(channelId)
            .then((snapshot) => {
              const channelData = snapshot;
              return { id: channelId, ...channelData };
            })
            .catch((error) => {
              console.error(`Error fetching channel data ${channelId}: ${error.message}`);
            })
          );

          Promise.all(channelPromises)
            .then((channelsDataArray) => {
              setAllChannels(channelsDataArray);
            })
            .catch((error) => console.error(`Error fetching channel details: ${error.message}`));
      }
    };

    getChannelDetails();
}, [teamDetails.channels]);

  const handleChannelDeletion = (channelData) => {

    deleteChannel(channelData)
      .then(() => {
        navigate(`/app/teams/${channelData.team}`);
        toast('Channel was deleted successfully');
      })
      .catch((e) => console.log(e.message));
  };

  return (
    <div className='flex flex-col gap-2'>
      <div className="flex flex-col bg-white rounded-md p-4 dark:bg-darkAccent dark:text-darkText">
        <div className='flex flex-col items-end mb-3'>
          <button onClick={openCreateChannelModal} className='btn bg-pink border-none text-pureWhite w-fit justify-center'><i className="fa-solid fa-users"></i>Add Channel</button>
          {isCreateChannelModalOpen && (
            <AddChannelModal teamId={teamDetails.id} teamParticipants={teamDetails.members} teamOwner={teamDetails.owner} isOpen={isCreateChannelModalOpen} onClose={closeCreateChannelModal} teamName={teamDetails.name}/>
          )}
        </div>
        {allChannels.map(channel => (
          <li key={channel.id} className='flex flex-row justify-between gap-2 p-2 mt-1 rounded-md items-center cursor-pointer hover:bg-pureWhite dark:hover:bg-darkFront'>
            <div className='flex flex-row gap-2 items-center justify-between w-full'>
              <div className='flex flex-row w-full'>
                <p className='place-self-center ' onClick={() => navigate(`/app/teams/${channel.team}/${channel.id}`)}>{channel.title}</p>
              </div>
              {channel.title !== 'General' && (
                <button onClick={() => handleChannelDeletion(channel)} className="btn btn-ghost btn-sm btn-square hover:!bg-grey text-blue">
                  <i className="fa-solid fa-trash"></i>
                </button>
              )}
            </div>
          </li>)
        )}
      </div>
    </div>
  )
}

ChannelsList.propTypes = {
  teamDetails: PropTypes.object,
};
