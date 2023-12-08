import { useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import ChatBox from "../../components/ChatBox/ChatBox";
import AppContext from "../../context/AuthContext";
import StartGroupChatModal from "../../components/StartGroupChatModal/StartGroupChatModal";
import StartPrivateChatModal from "../../components/StartPrivateChatModal/StartPrivateChatModal";
import { db } from "../../config/firebase-config";
import { ref, onValue } from 'firebase/database';
import EmptyList from "../../components/EmptyList/EmptyList";
import { useMediaQuery } from 'react-responsive';
import { sortByDateDesc } from "../../services/chats.services";

export default function ChatsLayout() {
  const [allLoggedUserChats, setAllLoggedUserChats] = useState([]);
  const loggedUser = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const chatsRef = ref(db, `chats`);
    const chatsListener = onValue(chatsRef, (snapshot) => {
      const updatedChatData = snapshot.val();

      if (updatedChatData) {
        const userChats = Object.entries(updatedChatData).filter(([, chat]) => {
          return chat.participants && chat.participants[loggedUser.userData?.handle];
        });

        // if user participates in chats, set chatData with new data
        if (userChats.length > 0) {
          const chats = userChats.map(([key, chat]) => {
            return {
              id: key,
              createdOn: chat.createdOn,
              isGroup: chat.isGroup,
              participants: chat.participants ? Object.keys(chat.participants) : [],
              messages: chat.messages ? Object.keys(chat.messages) : [],
              lastMessage: chat.lastMessage || '',
              participantsReadMsg: chat.participantsReadMsg || {}
            };
          });

          setAllLoggedUserChats(sortByDateDesc(chats));
          setIsLoading(false);
        }
      }
    });

    return () => {
      chatsListener();
    }
  }, [loggedUser.userData?.handle]);

  // Responsiveness
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1224px)'
  })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

  // Mobile states and functions
  const [activeMobileComponent, setActiveMobileComponent] = useState(0); // useLocation for Chats, 1 For Single Chat

  const handleChatLink = () => {
    setActiveMobileComponent(1);
  }

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/app/chats') {
      setActiveMobileComponent(location.pathname);
    }
  }, [location.pathname]);

  const { chatId } = useParams();
  useEffect(() => {
    if (chatId) {
      setActiveMobileComponent(1);
    }
  }, [chatId]);

  return (
    <>
      {isDesktopOrLaptop && <div className="mt-5">
        <div className="flex gap-3 h-[85vh] flex-row justify-start w-full dark:text-darkText">
          <div className="basis-1/5 bg-pureWhite rounded-md text-black overflow-auto [&::-webkit-scrollbar]:[width:8px]
            [&::-webkit-scrollbar-thumb]:bg-lightBlue [&::-webkit-scrollbar-thumb]:rounded-md dark:[&::-webkit-scrollbar-thumb]:bg-mint dark:bg-darkFront">
            <div className="sticky top-0 flex z-50 items-center justify-between p-2">
              <p className="font-black text-xl pt-2 pl-2 dark:text-darkText">Chats</p>
              <div className="flex">
                <div className="pt-2">
                  <StartPrivateChatModal />
                </div>
                <div className="pt-2">
                  <StartGroupChatModal />
                </div>
              </div>
            </div>
            <div className="divider m-1"></div>
            {allLoggedUserChats.length > 0 && (
              <div className="flex flex-col gap-1">
                {allLoggedUserChats.map(chat => (
                  <ChatBox key={chat.id} chatId={chat.id} onClick={handleChatLink} />)
                )}
              </div>
            )}
          </div>
          {!isLoading && <div className="basis-4/5 w-full rounded-md flex items-center place-content-evenly overflow-auto">
            {allLoggedUserChats.length > 0 ? (
              <Outlet />
            ) : (
              <EmptyList />
            )}
          </div>}
        </div>
      </div>}
      {isTabletOrMobile && <div className="mt-4">
        <div className="flex gap-3 h-[81vh] md:h-[87vh] flex-row justify-start w-full dark:text-darkText">
          {activeMobileComponent === '/app/chats' && <div className="w-full bg-pureWhite rounded-md text-black overflow-auto [&::-webkit-scrollbar]:[width:8px]
            [&::-webkit-scrollbar-thumb]:bg-lightBlue [&::-webkit-scrollbar-thumb]:rounded-md dark:[&::-webkit-scrollbar-thumb]:bg-mint dark:bg-darkFront">
            <div className="sticky top-0 flex z-50 items-center justify-between p-2">
              <p className="font-black text-xl pt-2 pl-2 dark:text-darkText">Chats</p>
              <div className="flex">
                <div className="pt-2">
                  <StartPrivateChatModal />
                </div>
                <div className="pt-2">
                  <StartGroupChatModal />
                </div>
              </div>
            </div>
            <div className="divider m-1"></div>
            {allLoggedUserChats.length > 0 && (
              <div className="flex flex-col gap-1">
                {allLoggedUserChats.map(chat => (
                  <ChatBox key={chat.id} chatId={chat.id} onClick={handleChatLink} />)
                )}
              </div>
            )}
          </div>}
          {activeMobileComponent === 1 && !isLoading && <div className="w-full rounded-md flex items-center pb-4">
            {allLoggedUserChats.length > 0 ? (
              <div className="w-full h-full flex flex-col items-start">
                <Outlet />
              </div>
            ) : (
              <EmptyList />
            )}
          </div>}
        </div>
      </div>}
    </>
  )
}
