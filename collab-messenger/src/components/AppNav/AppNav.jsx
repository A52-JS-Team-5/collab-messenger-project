import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../../context/AuthContext';
import iconLogo from '../../assets/app-icon/app-icon.svg';

export default function AppNav({ onLogout}) {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [photoURL, setPhotoURL] = useState('https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg')
    const user = useContext(AppContext);

    const handleClick = () => {
        const elem = document.activeElement;
        if (elem) {
            elem?.blur();
        }
    };

    useEffect(() => {
        if (user?.photoURL) {
            setPhotoURL(user.photoURL);
        }
    }, [user])

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

    return (
        <div className="flex flex-row gap-2 self-stretch w-full">
            <div className='flex flex-row justify-end gap-2 w-full'>
            <img src={iconLogo} className='max-h-12 cursor-pointer lg:hidden sm:max-lg:display-block' alt="Chatter App Logo" onClick={() => { navigate("/") }}/>
                <div className='flex flex-row gap-2 justify-center w-full'>
                    <input type='search' name='main-search' id='main-posts-search' value={searchTerm}
                        onKeyDown={handleEnterKeyPress} onChange={(e) => setSearchTerm(e.target.value)} className='input input-bordered w-full max-w-xl' placeholder="What are you searching for today?" />
                    <button onClick={handleSearch} className='btn bg-blue text-pureWhite border-none'><i className="fa-solid fa-magnifying-glass"></i></button>
                </div>
                {user !== null && (
                    <div className="dropdown dropdown-end">
                        <label tabIndex="0" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img src={photoURL} />
                            </div>
                        </label>
                        <ul tabIndex="0" className="dropdown-content z-[1] menu p-2 shadow-md bg-neutral-50 rounded-box w-52">
                            <li onClick={handleClick}><Link to={`/app/users/${user?.userData?.handle}`}>See Profile</Link></li>
                            <li onClick={handleClick}><Link to={`/app/users/${user?.userData?.handle}/edit`}>Edit Profile</Link></li>
                            <li onClick={handleClick}><Link to='/' onClick={onLogout} >Logout</Link></li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

AppNav.propTypes = {
    onLogout: PropTypes.func,
};
