import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteNotification, getNotificationById } from '../../services/notifications.services';
import AppContext from '../../context/AuthContext';

const InsightsNotification = ({ notificationId }) => {
    const navigate = useNavigate();
    const [notificationDetails, setNotificationDetails] = useState('');
    const user = useContext(AppContext);

    useEffect(() => {
        getNotificationById(notificationId)
            .then((data) =>
                setNotificationDetails(data))
            .catch((error) =>
                console.log(`Notification error: ${error.message}`))
    })

    const handleDelete = (e) => {
        e.stopPropagation();
        deleteNotification(user.userData.handle, notificationDetails.id);
    }

    const renderNotificationContent = () => {
        switch (notificationDetails.type) {
            case 'addedToTeam':
                return (
                    <div className="gap-4 items-center flex flex-row p-4 rounded-md bg-white w-full cursor-pointer dark:bg-darkAccent dark:text-darkText" onClick={() => navigate(`/app/teams/${notificationDetails.elemId}`)}>
                        <div className="gap-4 items-center flex flex-row w-full">
                            <div className="hidden md:flex flex-col rounded-full bg-[#C2F1D9] text-green items-center justify-center w-10 h-10 aspect-square">
                                <i className="fa-solid fa-user-plus"></i>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-left text-xs mb-1">{new Date(notificationDetails.timestamp).toLocaleDateString()}</p>
                                <h3 className='font-bold text-lg text-left'>{notificationDetails.message}</h3>
                                <p className="text-left">Let the collaboration begin!</p>
                            </div>
                        </div>
                        <button className="btn btn-ghost btn-square hover:!bg-pureWhite text-blue dark:hover:!bg-darkFront dark:text-yellow" onClick={(e) => handleDelete(e)}>
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                );
            case 'deletedTeam':
            case 'removedFromTeam':
                return (
                    <div className="gap-4 items-center flex flex-row p-4 rounded-md bg-white w-full dark:bg-darkAccent dark:text-darkText">
                        <div className="gap-4 items-center flex flex-row w-full">
                            <div className="hidden md:flex flex-col rounded-full bg-[#E3DDEB] text-[#573385] items-center justify-center w-10 h-10 aspect-square">
                                <i className="fa-solid fa-user-minus"></i>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-left text-xs mb-1">{new Date(notificationDetails.timestamp).toLocaleDateString()}</p>
                                <h3 className='font-bold text-lg text-left'>{notificationDetails.message}</h3>
                                <p className="text-left">You can still access other teams and channels.</p>
                            </div>
                        </div>
                        <button className="btn btn-ghost btn-square hover:!bg-pureWhite text-blue dark:hover:!bg-darkFront dark:text-yellow" onClick={(e) => handleDelete(e)}>
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                );
            case 'addedToChannel':
                return (
                    <div className="gap-4 items-center flex flex-row p-4 rounded-md bg-white w-full" onClick={() => navigate(notificationDetails.link)}>
                        <div className="gap-4 items-center flex flex-row w-full">
                            <div className="hidden md:flex flex-col rounded-full bg-lightBlue text-blue items-center justify-center w-10 h-10 aspect-square">
                                <i className="fa-solid fa-user-plus"></i>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-left text-xs mb-1">{new Date(notificationDetails.timestamp).toLocaleDateString()}</p>
                                <h3 className='font-bold text-lg text-left'>{notificationDetails.message}</h3>
                                <p className="text-left">Join the conversation in this new channel!</p>
                            </div>
                        </div>
                        <button className="btn btn-ghost btn-square hover:!bg-pureWhite text-blue dark:hover:!bg-darkFront dark:text-yellow" onClick={(e) => handleDelete(e)}>
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                );
            case 'removedFromChannel':
                return (
                    <div className="gap-4 items-center flex flex-row p-4 rounded-md bg-white w-full">
                        <div className="gap-4 items-center flex flex-row w-full">
                            <div className="hidden md:flex flex-col rounded-full bg-[#FDE5DB] text-[#E8825D] items-center justify-center w-10 h-10 aspect-square">
                                <i className="fa-solid fa-user-plus"></i>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-left text-xs mb-1">{new Date(notificationDetails.timestamp).toLocaleDateString()}</p>
                                <h3 className='font-bold text-lg text-left'>{notificationDetails.message}</h3>
                                <p className="text-left">Explore other channels to stay engaged.</p>
                            </div>
                        </div>
                        <button className="btn btn-ghost btn-square hover:!bg-pureWhite text-blue dark:hover:!bg-darkFront dark:text-yellow" onClick={(e) => handleDelete(e)}>
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return renderNotificationContent();
}

InsightsNotification.propTypes = {
    notificationId: PropTypes.string,
};

export default InsightsNotification;