import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../../context/AuthContext';

export default function AppNav({ onLogout}) {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [photoURL, setPhotoURL] = useState('https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg')
    const { pathname } = useLocation();
    const pageName = pathname.split('/').pop();
    const user = useContext(AppContext);

    const getPageTitle = (pageName) => {
        const isTeamsPage = pathname.includes('/app/teams/');

        if (isTeamsPage) {
            return "Team Details";
        } else {
            return pageName.charAt(0).toUpperCase() + pageName.slice(1);
        }
    };

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
        navigate('/search-results', { state: { searchTerm: searchTerm } });
        setSearchTerm('');
    }

    const handleEnterKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
            setSearchTerm('');
        }
    };

    return (
        <div className="flex flex-row gap-2">
            <div className='flex flex-row self-stretch basis-1/2 items-center'>
                <h1 className='text-2xl font-bold'>{getPageTitle(pageName)}</h1>
            </div>
            <div className='flex flex-row basis-1/2 justify-end gap-2'>
                <div className='flex flex-row gap-2 justify-center'>
                    <input type='search' name='main-search' id='main-posts-search' value={searchTerm}
                        onKeyDown={handleEnterKeyPress} onChange={(e) => setSearchTerm(e.target.value)} className='input input-bordered w-full max-w-xl' placeholder="What are you searching for today?" />
                    <button onClick={handleSearch} className='btn btn-outline' id='search-button'><i className="fa-solid fa-magnifying-glass"></i></button>
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
