import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../../context/AuthContext';
import iconLogo from '../../assets/app-icon/app-icon.svg';
import StatusBubble from '../StatusBubble/StatusBubble';
import { changeStatus } from '../../services/users.services';
import UserProfile from '../../views/UserProfile/UserProfile';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import { DEFAULT_USER_PHOTO } from '../../common/constants';

export default function AppNav({ onLogout }) {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [photoURL, setPhotoURL] = useState(DEFAULT_USER_PHOTO);
    const user = useContext(AppContext);
    const [currentStatus, setCurrentStatus] = useState(user.userData?.status);

    const handleStatusChange = (event) => {
        const selection = event.target.value;
        changeStatus(user.userData?.handle, selection);
        setCurrentStatus(selection);
    }

    useEffect(() => {
        if (user.userData?.photoURL) {
            setPhotoURL(user.userData.photoURL);
        }
    }, [user]);

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
        setIsDropdownOpen(false);
    };

    const closeUserProfileModal = () => {
        setIsUserProfileModalOpen(false);
        setIsDropdownOpen(false);
    };

    // State and functions for dropdown
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const handleDropDownClick = () => {
        setIsDropdownOpen(prev => !prev);
    }

    return (
        <div className="flex flex-row gap-2 self-stretch w-full">
            <div className='flex flex-row justify-end gap-2 w-full'>
                <img src={iconLogo} className='max-h-12 cursor-pointer xl:hidden sm:max-xl:display-block' alt="Chatter App Logo" onClick={() => { navigate("/") }} />
                <div className='flex flex-row gap-2 justify-center w-full'>
                    <input type='search' name='main-search' id='main-posts-search' value={searchTerm}
                        onKeyDown={handleEnterKeyPress} onChange={(e) => setSearchTerm(e.target.value)} className='input input-bordered w-full max-w-xl dark:!bg-darkInput' placeholder="What are you searching for today?" />
                    <button onClick={handleSearch} className='btn bg-blue text-pureWhite border-none hover:bg-darker-blue'><i className="fa-solid fa-magnifying-glass"></i></button>
                </div>
                {user !== null && (
                    <div className="dropdown dropdown-end">
                        <label tabIndex="0" className="btn btn-ghost btn-circle avatar" onClick={handleDropDownClick}>
                            <div className="w-10 rounded-full static">
                                <img src={photoURL} />
                            </div>
                            <StatusBubble view={'AppNav'} userHandle={user.userData?.handle} />
                        </label>
                        {isDropdownOpen && <ul tabIndex="0" className="dropdown-content z-[1000] menu p-2 shadow-md bg-neutral-50 rounded-box w-52 dark:bg-darkAccent">
                            <li className='dark:text-yellow'><select placeholder={currentStatus} onChange={handleStatusChange} className="select w-full max-w-xs bg-transparent dark:!bg-darkAccent">
                                <option className='dark:!text-darkText'>Online</option>
                                <option className='dark:!text-darkText'>Away</option>
                                <option className='dark:!text-darkText'>Offline</option>
                            </select>
                            </li>
                            <div className="divider m-0"></div>
                            <li onClick={openUserProfileModal}><a className='dark:text-yellow'>See Profile</a></li>
                            <li onClick={handleDropDownClick}><Link to={`/app/users/${user?.userData?.handle}/edit`} className='dark:text-yellow'>Edit Profile</Link></li>
                            <li onClick={handleDropDownClick}><Link to='/' onClick={onLogout} className='dark:text-yellow'>Logout</Link></li>
                            <div className="divider m-0 max-xl:display-flex xl:hidden"></div>
                            <li className='flex flex-row items-start max-xl:display-flex xl:hidden'><ThemeSwitcher /></li>
                        </ul>}
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
