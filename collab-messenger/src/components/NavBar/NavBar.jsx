import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AppContext from '../../context/AuthContext';
import './NavBar.css';

export default function NavBar({ user, onLogout, loggedUserHandle }) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const userData = useContext(AppContext);
  const [photoURL, setPhotoURL] = useState('https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg')

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

  //This is used for the mobile nav
  const handleLinkClick = () => {
    // Find the checkbox element and uncheck it
    const checkbox = document.querySelector('.drawer-checkbox');
    if (checkbox) {
      checkbox.checked = false;
    }
  };

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
    <nav className='sticky top-4 z-[50]'>
      <div id='navbar' className="navbar rounded-xl flex flex-row shadow-lg">
        <div className='basis-2/4 gap-2 search justify-center'>
          <input type='search' name='main-search' id='main-posts-search' value={searchTerm}
            onKeyDown={handleEnterKeyPress} onChange={(e) => setSearchTerm(e.target.value)} className='input input-bordered w-full max-w-xl' placeholder="What are you searching for today?" />
          <button onClick={handleSearch} className='btn btn-outline' id='search-button'><i className="fa-solid fa-magnifying-glass"></i></button>
        </div>
        <div className='basis-1/4 justify-end hidden 2xl:flex'>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li><Link to='/'>Home</Link></li>
              <li><Link to='/about'>About</Link></li>
              {user === null && <li><Link to='/register'>Register</Link></li>}
              {user === null && <li><Link to='/login'>Login</Link></li>}
            </ul>
          </div>
          {user !== null && loggedUserHandle && (
            <div className="dropdown dropdown-end">
              <label tabIndex="0" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src={photoURL} />
                </div>
              </label>
              <ul tabIndex="0" className="dropdown-content z-[1] menu p-2 shadow-md bg-neutral-50 rounded-box w-52">
                <li onClick={handleClick}><Link to={`/users/${loggedUserHandle}`}>See Profile</Link></li>
                <li onClick={handleClick}><Link to={`/users/${loggedUserHandle}/edit`}>Edit Profile</Link></li>
                <li onClick={handleClick}><Link to='/' onClick={onLogout} >Logout</Link></li>
              </ul>
            </div>
          )}
        </div>
        {/*Mobile Nav*/}
        <div className='basis-1/4 justify-end hidden max-2xl:flex'>
          <div className='flex flex-row gap-0.5 justify-end'>
            <input id="drawer" type="checkbox" className="drawer-toggle drawer-checkbox" />
            <div className="drawer-content">
              <label htmlFor="drawer" className="drawer-button btn btn-ghost m-1"><i className="fa-solid fa-bars fa-2xl"></i></label>
            </div>
            <div className="drawer-side">
              <label htmlFor="drawer" aria-label="close sidebar" className="drawer-overlay"></label>
              <ul className="menu p-4 w-4/5 min-h-full bg-base-200 text-base-content">
                {/* Sidebar content here */}
                <li onClick={handleLinkClick}><Link to='/'>Home</Link></li>
                <li><Link to='/about' onClick={handleLinkClick}>About</Link></li>
                {user === null && <li onClick={handleLinkClick}><Link to='/register'>Register</Link></li>}
                {user === null && <li onClick={handleLinkClick}><Link to='/login'>Login</Link></li>}
                {user !== null && loggedUserHandle && <li onClick={handleLinkClick}><Link to={`/users/${loggedUserHandle}`}>See Profile</Link></li>}
                {user !== null && loggedUserHandle && <li onClick={handleLinkClick}><Link to={`/users/${loggedUserHandle}/edit`}>Edit Profile</Link></li>}
                {user !== null && loggedUserHandle && <li onClick={handleLinkClick}><Link to='/' onClick={onLogout}>Logout</Link></li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

NavBar.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func,
  loggedUserHandle: PropTypes.string,
};

