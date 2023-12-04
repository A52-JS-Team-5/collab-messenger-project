import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../../context/AuthContext';
import iconLogo from '../../assets/app-icon/app-icon.svg';
import { db } from '../../config/firebase-config';
import { ref, onValue } from 'firebase/database';
import { changeStatus } from '../../services/users.services';
import UserProfile from '../../views/UserProfile/UserProfile';

export default function AppNav({ onLogout }) {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [photoURL, setPhotoURL] = useState('https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg')
    const user = useContext(AppContext);
    const [currentStatus, setCurrentStatus] = useState(user.userData?.status);
    const statusColors = {
        'Online': 'bg-green',
        'Offline': 'bg-black',
        'Away': 'bg-yellow'
    };

    const handleStatusChange = (event) => {
        const selection = event.target.value;
        if (user.userData?.status !== selection) {
            changeStatus(user.userData?.handle, selection);
            setCurrentStatus(selection);
        }
    }

    const handleClick = () => {
        const elem = document.activeElement;
        if (elem) {
            elem?.blur();
        }
    };

    useEffect(() => {
        if (user.userData?.photoURL) {
            setPhotoURL(user.userData.photoURL);
        }
    }, [user]);

    useEffect(() => {
        const userRef = ref(db, `users/${user.userData?.handle}/status`);
        const userStatusListener = onValue(userRef, (snapshot) => {
            const updatedStatus = snapshot.val();
            setCurrentStatus(updatedStatus);
        });

        return () => {
            userStatusListener();
        };
    }, [user.userData?.handle, currentStatus])

    const handleSearch = () => {
        navigate('/app/search-results', { state: { searchTerm: searchTerm } });
        setSearchTerm('');
    }

    const handleEnterKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
            setSearchTerm('');
        }
    };

    // State and functions for UserProfileModal
    const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);

    const openUserProfileModal = () => {
        setIsUserProfileModalOpen(true);
    };

    const closeUserProfileModal = () => {
        setIsUserProfileModalOpen(false);
    };

    return (
        <div className="flex flex-row gap-2 self-stretch w-full">
            <div className='flex flex-row justify-end gap-2 w-full'>
                <img src={iconLogo} className='max-h-12 cursor-pointer xl:hidden sm:max-xl:display-block' alt="Chatter App Logo" onClick={() => { navigate("/") }} />
                <div className='flex flex-row gap-2 justify-center w-full'>
                    <input type='search' name='main-search' id='main-posts-search' value={searchTerm}
                        onKeyDown={handleEnterKeyPress} onChange={(e) => setSearchTerm(e.target.value)} className='input input-bordered w-full max-w-xl' placeholder="What are you searching for today?" />
                    <button onClick={handleSearch} className='btn bg-blue text-pureWhite border-none'><i className="fa-solid fa-magnifying-glass"></i></button>
                </div>
                {user !== null && (
                    <div className="dropdown dropdown-end">
                        <label tabIndex="0" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full static">
                                <img src={photoURL} />
                            </div>
                            <div className={`absolute top-8 right-1 w-2 h-2 rounded-full ${statusColors[currentStatus]}`}></div>
                        </label>
                        <ul tabIndex="0" className="dropdown-content z-[1] menu p-2 shadow-md bg-neutral-50 rounded-box w-52">
                            <li><select placeholder={currentStatus} onChange={handleStatusChange} className="select w-full max-w-xs bg-transparent">
                                <option>Online</option>
                                <option>Away</option>
                                <option>Offline</option>
                            </select>
                            </li>
                            <div className="divider m-0"></div>
                            <li onClick={openUserProfileModal}><a>See Profile</a></li>
                            <li onClick={handleClick}><Link to={`/app/users/${user?.userData?.handle}/edit`}>Edit Profile</Link></li>
                            <li onClick={handleClick}><Link to='/' onClick={onLogout} >Logout</Link></li>
                        </ul>
                        {isUserProfileModalOpen && <UserProfile userHandle={user?.userData?.handle} isOpen={isUserProfileModalOpen} onClose={closeUserProfileModal} />}
                    </div>
                )}
            </div>
        </div>
    );
}

AppNav.propTypes = {
    onLogout: PropTypes.func,
};
