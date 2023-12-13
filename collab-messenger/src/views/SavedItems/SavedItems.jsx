import { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../../context/AuthContext";
import { onValue, ref } from "firebase/database";
import { db } from "../../config/firebase-config";
import savedItemsImage from '../../assets/saved-items-img/savedItems-bg.svg';
import notificationImg from '../../assets/no-notifications/no-notifications.svg';
import { getSavedMessageById } from "../../services/messages.services";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MessageBubble from "../../components/MessageBubble/MessageBubble";

const SavedItems = () => {
    const user = useContext(AppContext);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const endOfMsgsRef = useRef(null);

    useEffect(() => {
        if (user?.userData?.handle) {
            const userRef = ref(db, `users/${user.userData.handle}/savedMessages`);

            const userListener = onValue(userRef, (snapshot) => {
                if (snapshot.exists()) {
                    setItems(Object.keys(snapshot.val()));
                } else {
                    setItems([]);
                    setMessages([]);
                    setLoading(false);
                }
            })

            return () => {
                userListener();
            };
        }

    }, [user?.userData?.handle]);

    useEffect(() => {
        if (items.length > 0) {
            Promise.all(items.map(messageId => getSavedMessageById(messageId)))
                .then(messagesData => {
                    const validMessages = messagesData.filter(message => message !== null);
                    setMessages(validMessages);
                    setLoading(false);

                    if (validMessages.length > 0) {
                        endOfMsgsRef.current?.scrollIntoView({
                            behavior: "smooth",
                        });
                    }
                })
                .catch(error => {
                    toast('Cannot fetch messages. Please try again later.');
                    console.error('Error fetching messages:', error.message);
                })
        }
    }, [items]);

    return (
        <div className='mt-4 flex flex-row gap-4 h-[88vh] mt-4 w-full'>
            <div className='flex flex-col gap-4 w-full h-[81vh] xl:h-[88vh]'>
                <div className="flex flex-row justify-between rounded-md bg-pureWhite items-center h-1/6 dark:bg-darkFront dark:text-pureWhite">
                    <div className='flex flex-col gap-2 items-start max-xl:p-4 xl:p-6'>
                        <h2 className='text-xl font-bold text-left'>{`Welcome to your Saved Items, ${user?.userData?.name}! 🌟`}</h2>
                        <p className='text-left'>Explore your collection of cherished messages all in one place.</p>
                    </div>
                    <div className="h-full flex flex-col justify-center overflow-hidden basis-2/5 max-lg:hidden lg:display-flex lg:display-flex-col">
                        <img src={savedItemsImage} alt="Insights Background" className="h-96 opacity-90" />
                    </div>
                </div>
                <div className='flex flex-col rounded-md bg-pureWhite gap-2 max-xl:p-1 xl:p-2 dark:bg-darkFront dark:text-darkText overflow-hidden h-5/6'>
                    <div className="overflow-auto [&::-webkit-scrollbar]:[width:8px]
            [&::-webkit-scrollbar-thumb]:bg-lightBlue [&::-webkit-scrollbar-thumb]:rounded-md p-1 dark:[&::-webkit-scrollbar-thumb]:bg-mint">
                        {!loading && messages.length > 0 && (
                            <div className="overflow-y-auto px-2">
                                {messages.map(message => {
                                    const messageClass = user?.userData?.handle === message.author ? 'chat-end' : 'chat-start';
                                    const userAvatar = user?.userData?.handle === message.author ? user?.userData?.handle : message.author;
                                    const editMessageOption = user.userData?.handle === message.author;

                                    return (
                                        <div key={message.id}>
                                            <MessageBubble message={message} messageClass={messageClass} userAvatar={userAvatar} editMessageOption={editMessageOption} />
                                        </div>
                                    )
                                })}
                                <div ref={endOfMsgsRef} />
                            </div>
                        )}
                        {!loading && messages.length === 0 && (
                            <div className='flex flex-col gap-8 items-center justify-center self-center h-[60vh]'>
                                <img src={notificationImg} alt="No Notifications Image" className="max-h-80" />
                                <p>{`It's a bit quiet here. You've not saved anything yet. Start curating and bring this space to life!`}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SavedItems;