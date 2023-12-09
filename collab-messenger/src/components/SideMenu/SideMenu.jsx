import { Link, useLocation, useNavigate } from 'react-router-dom';
import iconLogo from '../../assets/app-icon/app-icon.svg'
import { useEffect, useState, useContext } from 'react';
import './SideMenu.css';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import { db } from "../../config/firebase-config";
import { ref, onValue } from 'firebase/database';
import AppContext from "../../context/AuthContext";

const SideMenu = () => {
    const [activeLink, setActiveLink] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const loggedUser = useContext(AppContext);
    const [areAllChatsRead, setAreAllChatsRead] = useState(true);
    const [areAllChannelsRead, setAreAllChannelsRead] = useState(true);

    useEffect(() => {
        setActiveLink(location.pathname);

        const chatsRef = ref(db, `chats`);
        const chatsListener = onValue(chatsRef, (snapshot) => {
            const updatedChatData = snapshot.val();

            if (updatedChatData !== null) {
                const userChats = Object.entries(updatedChatData).filter(([, chat]) => {
                    return chat.participants && chat.participants[loggedUser.userData?.handle] && chat.lastMessage !== chat.participantsReadMsg?.[loggedUser.userData?.handle];
                });

                if (userChats.length > 0) {
                    setAreAllChatsRead(false);
                } else {
                    setAreAllChatsRead(true);
                }
            }
        });

        const channelsRef = ref(db, 'channels');
        const channelsListener = onValue(channelsRef, (snapshot) => {
            const updatedChannelData = snapshot.val();

            if (updatedChannelData !== null) {
                const unreadChannels = Object.entries(updatedChannelData).filter(([, channel]) => {
                    return channel.participants && channel.participants[loggedUser.userData?.handle] && channel.lastMessage !== channel.participantsReadMsg?.[loggedUser.userData?.handle];
                });

                if (unreadChannels.length > 0) {
                    setAreAllChannelsRead(false);
                } else {
                    setAreAllChannelsRead(true);
                }
            }
        });

        return () => {
            chatsListener();
            channelsListener();
        }
    }, [location.pathname, loggedUser.userData?.handle]);

    return (
        <div className='flex flex-col max-xl:hidden xl:display-flex xl:display-flex-col pb-4'>
            <img src={iconLogo} className='max-h-14 cursor-pointer' alt="Chatter App Logo" onClick={() => { navigate("/") }} />
            <ul className="menu gap-2 rounded-box justify-center grow">
                <li>
                    <Link to="/app" className={`flex flex-col gap-2 h-20 justify-center !text-blue dark:!text-yellow ${activeLink === '/app' ? '!bg-lightBlue dark:!bg-darkFront dark:!"text-yellow' : 'hover:!text-blue hover:!bg-lightBlue focus:!bg-blue30 dark:hover:!text-yellow dark:hover:!bg-darkFront dark:focus:!bg-darkAccent'}`}>
                        <i className="fa-solid fa-house"></i>
                        <p className='text-xs'>Insights</p>
                    </Link>
                </li>
                <li>
                    <Link to="/app/chats" className={`relative flex flex-col gap-2 h-20 justify-center !text-blue dark:!text-yellow ${activeLink.includes('/app/chats') ? '!bg-lightBlue dark:!bg-darkFront dark:!"text-yellow' : 'hover:!text-blue hover:!bg-lightBlue focus:!bg-blue30 dark:hover:!text-yellow dark:hover:!bg-darkFront dark:focus:!bg-darkAccent'}`}>
                        {areAllChatsRead === true ? (
                            <div className='absolute top-2 right-2'>
                                <div className='w-2 h-2 rounded-full bg-transparent'></div>
                            </div>
                        ) : (
                            <div className='absolute top-2 right-2'>
                                <div className='w-2 h-2 rounded-full bg-pink'></div>
                            </div>
                        )}
                        <i className="fa-solid fa-message"></i>
                        <p className='text-xs'>Chats</p>
                    </Link>
                </li>
                <li>
                    <Link to="/app/teams" className={`relative flex flex-col gap-2 h-20 justify-center !text-blue dark:!text-yellow ${activeLink.includes('/app/teams') ? '!bg-lightBlue dark:!bg-darkFront dark:!"text-yellow' : 'hover:!text-blue hover:!bg-lightBlue focus:!bg-blue30 dark:hover:!text-yellow dark:hover:!bg-darkFront dark:focus:!bg-darkAccent'}`}>
                        {areAllChannelsRead === true ? (
                            <div className='absolute top-2 right-2'>
                                <div className='w-2 h-2 rounded-full bg-transparent'></div>
                            </div>
                        ) : (
                            <div className='absolute top-2 right-2'>
                                <div className='w-2 h-2 rounded-full bg-pink'></div>
                            </div>
                        )}
                        <i className="fa-solid fa-users"></i>
                        <p className='text-xs'>Teams</p>
                    </Link>
                </li>
                <li>
                    <Link to="/app/later" className={`flex flex-col gap-2 h-20 justify-center !text-blue dark:!text-yellow ${activeLink.includes('/app/later') ? '!bg-lightBlue dark:!bg-darkFront dark:!"text-yellow' : 'hover:!text-blue hover:!bg-lightBlue focus:!bg-blue30 dark:hover:!text-yellow dark:hover:!bg-darkFront dark:focus:!bg-darkAccent'}`}>
                        <i className="fa-solid fa-bookmark"></i>
                        <p className='text-xs'>Later</p>
                    </Link>
                </li>
            </ul>
            <ThemeSwitcher />
        </div>
    )
}

export default SideMenu;