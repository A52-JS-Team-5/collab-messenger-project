import { useContext, useEffect, useState } from "react";
import { getLoggedUserChats, sortByDateDesc } from "../../services/chats.services";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Outlet } from "react-router-dom";
import ChatBox from "../../components/ChatBox/ChatBox";
import AppContext from "../../context/AuthContext";
import StartGroupChatModal from "../../components/StartGroupChatModal/StartGroupChatModal";
import { db } from "../../config/firebase-config";
import { ref, onValue } from 'firebase/database';

export default function ChatsLayout() {
  const [allLoggedUserChats, setAllLoggedUserChats] = useState([]);
  const loggedUser = useContext(AppContext);
  const [userChatIds, setUserChatIds] = useState([]);

  useEffect(() => {
    getLoggedUserChats(loggedUser.userData?.handle)
      .then(chats => {
        const sortedChats = sortByDateDesc(chats);
        setAllLoggedUserChats(sortedChats);
        setUserChatIds(Object.keys(sortedChats));
      })
      .catch(e => {
        toast('Error in getting chats. Please try again.')
        console.log(e.message)
      })

    const chatsRef = ref(db, `chats`);
    const chatsListener = onValue(chatsRef, (snapshot) => {
      const updatedChatData = snapshot.val();

      if (updatedChatData) {
        const chatIds = Object.keys(updatedChatData);
        const userChats = [];

        // check if user participates in changed chats 
        chatIds.forEach(chat => {
          if (userChatIds.includes(chat)) {
            userChats.push(chat)
          }
        })

        // if user participates in chats, set chatData with new data
        if (userChats.length > 0) {
          userChats.map((key) => {
            const chat = updatedChatData[key];
              
            return {
              id: key,
              createdOn: chat.createdOn,
              isGroup: chat.isGroup,
              participants: chat.participants ? Object.keys(chat.participants) : [],
              messages: chat.messages ? Object.keys(chat.messages) : [],
              lastMessage: chat.lastMessage || ''
            };
          });
          setAllLoggedUserChats(updatedChatData)
        }
      }
    });

    return () => {
      chatsListener();
    }
  
  }, [loggedUser.userData?.handle, userChatIds])

  return (
    <>
      <div className="flex flex-row justify-start w-full">
        <div className="basis-80 h-[91vh] bg-grey text-black">
          <div className="p-2 flex place-content-end">
            <StartGroupChatModal />
          </div>
          <div className="flex flex-col gap-1">
            {allLoggedUserChats.map(chat => (
              <ChatBox key={chat.id} chatId={chat.id}/>)
            )}
          </div>
        </div>
        <div className="basis-11/12 w-full h-[92vh] flex items-center place-content-evenly overflow-auto">
          <Outlet />
        </div>
      </div>
    </>
  )
}
