import { useContext, useEffect, useState } from "react";
import AppContext from "../../context/AuthContext";
import insightsWelcome from '../../assets/insights-img/insights-welcome.svg';
import { useNavigate } from "react-router-dom";
import notificationImg from '../../assets/no-notifications/no-notifications.svg';
import InsightsNotification from "../../components/InsightsNotification/InsightsNotification";
import { onValue, ref } from "firebase/database";
import { db } from "../../config/firebase-config";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getSavedMessageById } from "../../services/messages.services";

const Insights = () => {
    const user = useContext(AppContext);
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (user?.userData?.handle) {
            const userRef = ref(db, `users/${user.userData.handle}`);

            const userListener = onValue(userRef, (snapshot) => {
                if (snapshot.exists()) {
                    setUserDetails(snapshot.val());
                    setLoading(false);
                } else {
                    toast('Cannot load user profile. Please try again later.');
                }
            })

            return () => {
                userListener();
            };
        }

    }, [user?.userData?.handle]);

    useEffect(() => {
        if (userDetails?.savedMessages && Object.keys(userDetails?.savedMessages).length > 0) {
            Promise.all(Object.keys(userDetails.savedMessages).map(messageId => getSavedMessageById(messageId)))
                .then(messagesData => {
                    const validMessages = messagesData.filter(message => message !== null);
                    setMessages(validMessages);
                    setLoading(false);
                })
                .catch(error => {
                    toast('Cannot fetch messages. Please try again later.');
                    console.error('Error fetching messages:', error.message);
                })
        }
    }, [userDetails?.savedMessages]);

    return (
        !loading && <div className='mt-4 flex flex-row gap-4 h-[88vh] mt-4 w-full'>
            <div className='flex flex-col gap-4 w-full h-[81vh] xl:h-[88vh]'>
                <div className="flex flex-row justify-between rounded-md bg-pureWhite items-center h-1/5 dark:bg-darkFront dark:text-pureWhite">
                    <div className='flex flex-col gap-2 items-start max-xl:p-4 xl:p-6 max-lg:basis-5/5 lg:basis-3/5'>
                        <h2 className='text-xl font-bold text-left'>{`👋 Hey, ${userDetails?.name}! Thrilled to have you on board.`}</h2>
                        <p className='text-left'>Stay up to date with your friends and teams.</p>
                    </div>
                    <div className="h-full flex flex-col justify-center overflow-hidden basis-2/5 max-lg:hidden lg:display-flex lg:display-flex-col">
                        <img src={insightsWelcome} alt="Insights Background" className="h-96 opacity-90" />
                    </div>
                </div>
                <div className='flex flex-col rounded-md bg-pureWhite gap-2 max-xl:p-4 xl:p-6 dark:bg-darkFront dark:text-darkText overflow-hidden h-4/5'>
                    <h2 className='text-sm font-bold text-left'>Teams & Channels News</h2>
                    {userDetails?.notifications && Object.keys(userDetails?.notifications).length > 0 ? (
                        <div className='flex flex-col gap-2 overflow-y-auto [&::-webkit-scrollbar]:[width:8px] [&::-webkit-scrollbar-thumb]:bg-lightBlue [&::-webkit-scrollbar-thumb]:rounded-md p-1 dark:[&::-webkit-scrollbar-thumb]:bg-mint'>
                            <div className='flex flex-col gap-2'>
                                {Object.keys(userDetails?.notifications).reverse().map(notification => (
                                    <div className='flex flex-col w-full' key={notification}>
                                        <InsightsNotification notificationId={notification} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className='flex flex-col gap-8 items-center justify-center h-full'>
                            <img src={notificationImg} alt="No Notifications Image" className="max-h-80" />
                            <p>{`It's a bit quiet here. No updates or notifications yet.`}</p>
                        </div>
                    )}
                </div>
            </div>
            <div className='flex flex-col basis-1/4 rounded-md bg-pureWhite max-xl:p-4 xl:p-6 justify-between max-xl:basis-2/5 max-sm:hidden h-[81vh] xl:h-[88vh] dark:bg-darkFront dark:text-darkText'>
                <div className='flex flex-col items-center gap-4'>
                    <img src={userDetails?.photoURL} alt="Avatar" className="h-32 w-32 opacity-90 aspect-square rounded-full" />
                    <div className='flex flex-col'>
                        <h2 className='text-xl font-bold'>{userDetails?.name}{' '}{userDetails?.surname}</h2>
                        <p>@{userDetails?.handle}</p>
                    </div>
                </div>
                <div className='flex flex-col gap-4 items-start'>
                    <h2 className='text-sm font-bold text-left'>Engagement Summary</h2>
                    <div className="grid-cols-2 grid gap-4 w-full max-2xl:grid-cols-1">
                        <div className="flex flex-col gap-2 p-4 rounded-md bg-white w-full items-center max-2xl:flex-row dark:bg-darkAccent dark:text-darkText">
                            <div className="flex flex-col rounded-full bg-pink text-pureWhite items-center justify-center w-10 h-10 aspect-square">
                                <h2>{userDetails?.chats ? Object.keys(userDetails?.chats).length : 0}</h2>
                            </div>
                            <p>Chats</p>
                        </div>
                        <div className="flex flex-col gap-2 p-4 rounded-md bg-white w-full items-center max-2xl:flex-row dark:bg-darkAccent dark:text-darkText">
                            <div className="flex flex-col rounded-full bg-yellow text-black items-center justify-center w-10 h-10 aspect-square">
                                <h2>{userDetails?.teamsMember ? Object.keys(userDetails?.teamsMember).length : 0}</h2>
                            </div>
                            <p>Teams</p>
                        </div>
                        <div className="flex flex-col gap-2 p-4 rounded-md bg-white w-full items-center max-2xl:flex-row dark:bg-darkAccent dark:text-darkText">
                            <div className="flex flex-col rounded-full bg-green text-black items-center justify-center w-10 h-10 aspect-square">
                                <h2>{userDetails?.channels ? Object.keys(userDetails?.channels).length : 0}</h2>
                            </div>
                            <p>Channels</p>
                        </div>
                        <div className="flex flex-col gap-2 p-4 rounded-md bg-white w-full items-center max-2xl:flex-row dark:bg-darkAccent dark:text-darkText">
                            <div className="flex flex-col rounded-full bg-blue text-pureWhite items-center justify-center w-10 h-10 aspect-square">
                                <h2>{messages ? messages.length : 0}</h2>
                            </div>
                            <p>Saved Items</p>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-4 items-start max-2xl:hidden 2xl:display-flex 2xl:display-flex-col'>
                    <h2 className='text-sm font-bold text-left'>Quick Access</h2>
                    <div className="flex flex-col gap-4 w-full">
                        <ul>
                            <li className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer hover:bg-white p-2 text-blue text-md text-left font-medium rounded-md dark:hover:bg-darkAccent dark:text-darkText" onClick={() => navigate('/app/teams')}>
                                <div className="flex flex-col rounded-full bg-[#C2F1D9] text-green items-center justify-center w-10 h-10 aspect-square">
                                    <i className="fa-solid fa-users"></i>
                                </div>
                                <p>Your Teams</p>
                            </li>
                            <li className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer hover:bg-white p-2 text-blue text-md text-left font-medium rounded-md dark:hover:bg-darkAccent dark:text-darkText" onClick={() => navigate('/app/chats')}>
                                <div className="flex flex-col rounded-full bg-[#FFE7FE] text-pink items-center justify-center w-10 h-10 aspect-square">
                                    <i className="fa-solid fa-message"></i>
                                </div>
                                <p>Your Chats</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='flex flex-col gap-4 items-start max-xl:hidden xl:display-flex xl:display-flex-col'>
                    <h2 className='text-sm font-bold text-left'>Help</h2>
                    <div className="flex flex-col gap-4 w-full">
                        <ul>
                            <li className="flex justify-between items-center cursor-pointer hover:bg-white p-2 text-blue text-md text-left font-medium rounded-md dark:hover:bg-darkAccent dark:text-darkText" onClick={() => navigate('/faq')}>
                                <p>Help</p>
                                <i className="fa-solid fa-arrow-right"></i>
                            </li>
                            <li className="flex justify-between items-center cursor-pointer hover:bg-white p-2 text-blue text-md text-left font-medium rounded-md dark:hover:bg-darkAccent dark:text-darkText" onClick={() => navigate('/about')}>
                                <p>About</p>
                                <i className="fa-solid fa-arrow-right"></i>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Insights;