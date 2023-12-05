import { useContext, useEffect, useState } from "react";
import { getLoggedUserChats, sortByDateDesc } from "../../services/chats.services";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Outlet } from "react-router-dom";
import ChatBox from "../../components/ChatBox/ChatBox";
import AppContext from "../../context/AuthContext";
import StartGroupChatModal from "../../components/StartGroupChatModal/StartGroupChatModal";
import StartPrivateChatModal from "../../components/StartPrivateChatModal/StartPrivateChatModal";
import { db } from "../../config/firebase-config";
import { ref, onValue } from 'firebase/database';
import EmptyList from "../../components/EmptyList/EmptyList";

export default function ChatsLayout() {
  const [allLoggedUserChats, setAllLoggedUserChats] = useState([]);
  const loggedUser = useContext(AppContext);
  const [userChatIds, setUserChatIds] = useState([]);

  useEffect(() => {
    getLoggedUserChats(loggedUser.userData?.handle)
      .then(chats => {
        const sortedChats = sortByDateDesc(chats);
        setAllLoggedUserChats(sortedChats);
        setUserChatIds(sortedChats.map(chat => chat.id));
      })
      .catch(e => {
        toast('Error in getting chats. Please try again.')
        console.log(e.message)
      })
  
  }, [loggedUser.userData?.handle]);

  useEffect(() => {
    const chatsRef = ref(db, `chats`);
    const chatsListener = onValue(chatsRef, (snapshot) => {
      const updatedChatData = snapshot.val();

      if (updatedChatData) {
        const userChats = Object.entries(updatedChatData).filter(([ , chat]) => {
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
        }
      }
    });

    return () => {
      chatsListener();
    }
  }, [userChatIds, loggedUser.userData?.handle]);

  return (
    <div className="mt-5">
      <div className="flex gap-3 h-[85vh] flex-row justify-start w-full dark:text-darkText">
        <div className="basis-80 bg-pureWhite rounded-md text-black overflow-auto [&::-webkit-scrollbar]:[width:8px]
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
                <ChatBox key={chat.id} chatId={chat.id}/>)
              )}
            </div>
          )}
        </div>
        <div className="w-full rounded-md flex items-center place-content-evenly overflow-auto">
          {allLoggedUserChats.length > 0  ? (
            <Outlet />
          ) : (
            <EmptyList />
          )}
        </div>
      </div>
    </div>
  )
}
