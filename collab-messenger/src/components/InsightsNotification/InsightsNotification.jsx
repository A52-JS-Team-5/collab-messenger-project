import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteNotification, markNotificationAsRead, markNotificationAsUnread } from '../../services/notifications.services';
import AppContext from '../../context/AuthContext';
import { onValue, ref } from 'firebase/database';
import { db } from '../../config/firebase-config';
import { ADDED_TO_CHANNEL_TYPE, ADDED_TO_TEAM_TYPE, CREATED_CHANNEL_TYPE, DELETED_TEAM_TYPE, REMOVED_FROM_CHANNEL_TYPE, REMOVED_FROM_TEAM_TYPE } from '../../common/constants';

const InsightsNotification = ({ notificationId }) => {
    const navigate = useNavigate();
    const [notificationDetails, setNotificationDetails] = useState('');
    const user = useContext(AppContext);

    useEffect(() => {
        const notificationRef = ref(db, `notifications/${notificationId}`);

        const notificationListener = onValue(notificationRef, (snapshot) => {
            const data = snapshot.val();

            if (data !== null) {
                const newData = {
                    id: notificationId,
                    message: data.message,
                    type: data.type,
                    elemId: data.elemId ? data.elemId : null,
                    timestamp: data.timestamp,
                    readBy: data.readBy ? Object.keys(data.readBy) : [],
                }
                setNotificationDetails(newData);
            } else {
                setNotificationDetails(null);
            }
        })

        return () => {
            notificationListener();
        };
    }, [notificationId])

    const handleDelete = (e) => {
        e.stopPropagation();
        deleteNotification(user.userData.handle, notificationDetails.id);
    }

    const timeOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
    };

    const handleMarkAsRead = (e) => {
        e.stopPropagation();
        markNotificationAsRead(user.userData.handle, notificationDetails.id);
    }

    const handleMarkAsUnread = (e) => {
        e.stopPropagation();
        markNotificationAsUnread(user.userData.handle, notificationDetails.id);
    }

    const renderNotificationContent = () => {
        switch (notificationDetails.type) {
            case ADDED_TO_TEAM_TYPE:
                return (
                    <div className={`${!notificationDetails?.readBy?.includes(user?.userData?.handle) ? ' bg-unreadNotification dark:bg-darkAccent' : 'bg-white dark:bg-darkInput'} relative gap-4 items-center flex flex-row p-4 rounded-md w-full cursor-pointer dark:text-darkText`} onClick={() => navigate(`/app/teams/${notificationDetails.elemId}`)}>
                        {!notificationDetails?.readBy?.includes(user?.userData?.handle) && <div className='absolute top-2 right-2 w-2 h-2 rounded-full bg-pink'></div>}
                        <div className="gap-4 items-center flex flex-row w-full">
                            <div className="hidden md:flex flex-col rounded-full bg-[#C2F1D9] text-green items-center justify-center w-10 h-10 aspect-square">
                                <i className="fa-solid fa-user-plus"></i>
                            </div>
                            <div className="flex flex-col">
                                <time className="text-left text-xs mb-1">{new Date(notificationDetails.timestamp).toLocaleString('en-GB', timeOptions)}</time>
                                <h3 className='font-bold text-lg text-left'>{notificationDetails.message}</h3>
                                <p className="text-left">Let the collaboration begin!</p>
                            </div>
                        </div>
                        <div className='flex flex-col md:flex-row gap-1'>
                            {!notificationDetails?.readBy?.includes(user?.userData?.handle) && <button className="btn btn-ghost btn-sm btn-square hover:!bg-pureWhite text-blue dark:hover:!bg-darkFront dark:text-yellow" onClick={(e) => handleMarkAsRead(e)}>
                                <i className="fa-solid fa-envelope-open"></i>
                            </button>}
                            {notificationDetails?.readBy?.includes(user?.userData?.handle) && <button className="btn btn-ghost btn-sm btn-square hover:!bg-pureWhite text-blue dark:hover:!bg-darkFront dark:text-yellow" onClick={(e) => handleMarkAsUnread(e)}>
                                <i className="fa-solid fa-envelope"></i>
                            </button>}
                            <button className="btn btn-ghost btn-sm btn-square hover:!bg-pureWhite text-blue dark:hover:!bg-darkFront dark:text-yellow" onClick={(e) => handleDelete(e)}>
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                );
            case DELETED_TEAM_TYPE:
            case REMOVED_FROM_TEAM_TYPE:
                return (
                    <div className={`${!notificationDetails?.readBy?.includes(user?.userData?.handle) ? ' bg-unreadNotification dark:bg-darkAccent' : 'bg-white dark:bg-darkInput'} relative gap-4 items-center flex flex-row p-4 rounded-md w-full cursor-pointer dark:text-darkText`}>
                        {!notificationDetails?.readBy?.includes(user?.userData?.handle) && <div className='absolute top-2 right-2 w-2 h-2 rounded-full bg-pink'></div>}
                        <div className="gap-4 items-center flex flex-row w-full">
                            <div className="hidden md:flex flex-col rounded-full bg-[#E3DDEB] text-[#573385] items-center justify-center w-10 h-10 aspect-square">
                                <i className="fa-solid fa-user-minus"></i>
                            </div>
                            <div className="flex flex-col">
                                <time className="text-left text-xs mb-1">{new Date(notificationDetails.timestamp).toLocaleString('en-GB', timeOptions)}</time>
                                <h3 className='font-bold text-lg text-left'>{notificationDetails.message}</h3>
                                <p className="text-left">You can still access other teams and channels.</p>
                            </div>
                        </div>
                        <div className='flex flex-col md:flex-row gap-1'>
                            {!notificationDetails?.readBy?.includes(user?.userData?.handle) && <button className="btn btn-ghost btn-sm btn-square hover:!bg-pureWhite text-blue dark:hover:!bg-darkFront dark:text-yellow" onClick={(e) => handleMarkAsRead(e)}>
                                <i className="fa-solid fa-envelope-open"></i>
                            </button>}
                            {notificationDetails?.readBy.length > 0 && notificationDetails?.readBy?.includes(user?.userData?.handle) && <button className="btn btn-ghost btn-sm btn-square hover:!bg-pureWhite text-blue dark:hover:!bg-darkFront dark:text-yellow" onClick={(e) => handleMarkAsUnread(e)}>
                                <i className="fa-solid ffa-envelope"></i>
                            </button>}
                            <button className="btn btn-ghost btn-sm btn-square hover:!bg-pureWhite text-blue dark:hover:!bg-darkFront dark:text-yellow" onClick={(e) => handleDelete(e)}>
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                );
            case CREATED_CHANNEL_TYPE:
            case ADDED_TO_CHANNEL_TYPE:
                return (
                    <div className={`${!notificationDetails?.readBy?.includes(user?.userData?.handle) ? ' bg-unreadNotification dark:bg-darkAccent' : 'bg-white dark:bg-darkInput'} relative gap-4 items-center flex flex-row p-4 rounded-md w-full cursor-pointer dark:text-darkText`} onClick={() => navigate(notificationDetails.link)}>
                        {!notificationDetails?.readBy?.includes(user?.userData?.handle) && <div className='absolute top-2 right-2 w-2 h-2 rounded-full bg-pink'></div>}
                        <div className="gap-4 items-center flex flex-row w-full">
                            <div className="hidden md:flex flex-col rounded-full bg-lightBlue text-blue items-center justify-center w-10 h-10 aspect-square">
                                <i className="fa-solid fa-user-plus"></i>
                            </div>
                            <div className="flex flex-col">
                                <time className="text-left text-xs mb-1">{new Date(notificationDetails.timestamp).toLocaleString('en-GB', timeOptions)}</time>
                                <h3 className='font-bold text-lg text-left'>{notificationDetails.message}</h3>
                                <p className="text-left">Join the conversation in this new channel!</p>
                            </div>
                        </div>
                        <div className='flex flex-row gap-1'>
                            {!notificationDetails?.readBy?.includes(user?.userData?.handle) && <button className="btn btn-ghost btn-sm btn-square hover:!bg-pureWhite text-blue dark:hover:!bg-darkFront dark:text-yellow" onClick={(e) => handleMarkAsRead(e)}>
                                <i className="fa-solid fa-envelope-open"></i>
                            </button>}
                            {notificationDetails?.readBy.length > 0 && notificationDetails?.readBy?.includes(user?.userData?.handle) && <button className="btn btn-ghost btn-sm btn-square hover:!bg-pureWhite text-blue dark:hover:!bg-darkFront dark:text-yellow" onClick={(e) => handleMarkAsUnread(e)}>
                                <i className="fa-solid fa-envelope"></i>
                            </button>}
                            <button className="btn btn-ghost btn-sm btn-square hover:!bg-pureWhite text-blue dark:hover:!bg-darkFront dark:text-yellow" onClick={(e) => handleDelete(e)}>
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                );
            case REMOVED_FROM_CHANNEL_TYPE:
                return (
                    <div className={`${!notificationDetails?.readBy?.includes(user?.userData?.handle) ? ' bg-unreadNotification dark:bg-darkAccent' : 'bg-white dark:bg-darkInput'} relative gap-4 items-center flex flex-row p-4 rounded-md w-full cursor-pointer dark:text-darkText`}>
                        {!notificationDetails?.readBy?.includes(user?.userData?.handle) && <div className='absolute top-2 right-2 w-2 h-2 rounded-full bg-pink'></div>}
                        <div className="gap-4 items-center flex flex-row w-full">
                            <div className="hidden md:flex flex-col rounded-full bg-[#FDE5DB] text-[#E8825D] items-center justify-center w-10 h-10 aspect-square">
                                <i className="fa-solid fa-user-plus"></i>
                            </div>
                            <div className="flex flex-col">
                                <time className="text-left text-xs mb-1">{new Date(notificationDetails.timestamp).toLocaleString('en-GB', timeOptions)}</time>
                                <h3 className='font-bold text-lg text-left'>{notificationDetails.message}</h3>
                                <p className="text-left">Explore other channels to stay engaged.</p>
                            </div>
                        </div>
                        <div className='flex flex-col md:flex-row gap-1'>
                            {!notificationDetails?.readBy?.includes(user?.userData?.handle) && <button className="btn btn-ghost btn-sm btn-square hover:!bg-pureWhite text-blue dark:hover:!bg-darkFront dark:text-yellow" onClick={(e) => handleMarkAsRead(e)}>
                                <i className="fa-solid fa-envelope-open"></i>
                            </button>}
                            {notificationDetails?.readBy.length > 0 && notificationDetails?.readBy?.includes(user?.userData?.handle) && <button className="btn btn-ghost btn-sm btn-square hover:!bg-pureWhite text-blue dark:hover:!bg-darkFront dark:text-yellow" onClick={(e) => handleMarkAsUnread(e)}>
                                <i className="fa-solid fa-envelope"></i>
                            </button>}
                            <button className="btn btn-ghost btn-sm btn-square hover:!bg-pureWhite text-blue dark:hover:!bg-darkFront dark:text-yellow" onClick={(e) => handleDelete(e)}>
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
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