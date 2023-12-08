import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { db } from "../../config/firebase-config";
import { ref, onValue } from 'firebase/database';
import AppContext from "../../context/AuthContext";

const MobileSideMenu = () => {
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
    
          if (updatedChatData) {
            const userChats = Object.entries(updatedChatData).filter(([ , chat]) => {
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
            
          if (updatedChannelData) {
            const unreadChannels = Object.entries(updatedChannelData).filter(([ , channel]) => {
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

    const handleLinkClick = (link) => {
        navigate(link);
    };

    return (
        <div className="fixed z-50 w-full h-16 max-w-xs -translate-x-1/2 bg-lightBlue rounded-full bottom-4 left-1/2 xl:hidden sm:max-xl:display-block dark:bg-darkInput">
            <div className="grid h-full grid-cols-4">
                <button onClick={() => handleLinkClick('/app')} type="button" className={`${activeLink === '/app' && 'bg-blue text-white dark:bg-darkFront'} inline-flex flex-col items-center justify-center px-5 rounded-s-full hover:bg-gray-50 group text-blue dark:text-yellow`}>
                    <i className="fa-solid fa-house"></i>
                    <span className="sr-only">Insights</span>
                </button>
                <button onClick={() => handleLinkClick('/app/chats')} type="button" className={`${activeLink.includes('/app/chats') && 'bg-blue text-white dark:bg-darkFront'} inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group text-blue dark:text-yellow`}>
                    {areAllChatsRead === true ? (
                        <div className='pl-9'>
                            <div className='w-2 h-2 rounded-full bg-transparent'></div>
                        </div>
                    ) : (
                        <div className='pl-9'>
                            <div className='w-2 h-2 rounded-full bg-pink'></div>
                         </div>
                    )}
                    <i className="fa-solid fa-message"></i>
                    <span className="sr-only">Chats</span>
                </button>
                <button onClick={() => handleLinkClick('/app/teams')} type="button" className={`${activeLink.includes('/app/teams') && 'bg-blue text-white dark:bg-darkFront'} inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group text-blue dark:text-yellow`}>
                    {areAllChannelsRead === true ? (
                        <div className='pl-9'>
                            <div className='w-2 h-2 rounded-full bg-transparent'></div>
                        </div>
                    ) : (
                        <div className='pl-9'>
                            <div className='w-2 h-2 rounded-full bg-pink'></div>
                         </div>
                    )}
                    <i className="fa-solid fa-users"></i>
                    <span className="sr-only">Teams</span>
                </button>
                <button onClick={() => handleLinkClick('/app/later')} type="button" className={`${activeLink.includes('/app/later') && 'bg-blue text-white dark:bg-darkFront'} inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-gray-50 group text-blue dark:text-yellow`}>
                    <i className="fa-solid fa-bookmark"></i>
                    <span className="sr-only">Later</span>
                </button>
            </div>
        </div>
    )
}

export default MobileSideMenu