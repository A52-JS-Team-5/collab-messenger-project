import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';
import AppContext from '../../context/AuthContext';
import { DEFAULT_USER_PHOTO } from '../../common/constants';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import iconLogo from '../../assets/app-icon/app-icon.svg';
import logoType from '../../assets/app-icon/chatter-logotype.svg';
import logoTypeDark from '../../assets/app-icon/chatter-logotype-dark.svg';

export default function NavBar({ onLogout }) {
  const navigate = useNavigate();
  const user = useContext(AppContext);
  const [photoURL, setPhotoURL] = useState(DEFAULT_USER_PHOTO);

  const handleClick = () => {
    const elem = document.activeElement;
    if (elem) {
      elem?.blur();
    }
  };

  useEffect(() => {
    if (user?.userData?.photoURL) {
      setPhotoURL(user.userData.photoURL);
    }
  }, [user?.userData?.photoURL])

  //This is used for the mobile nav
  const handleLinkClick = () => {
    // Find the checkbox element and uncheck it
    const checkbox = document.querySelector('.drawer-checkbox');
    if (checkbox) {
      checkbox.checked = false;
    }
  };

  return (
    <nav className='sticky top-0 z-[50]'>
      <div id='navbar' className="navbar rounded-xl flex flex-row shadow-lg dark:!bg-darkFront dark:!border-none">
        <div className="basis-1/4 gap-2">
          <img src={iconLogo} className='max-h-10 cursor-pointer' id='iconLogo' alt="Chatter Logo" onClick={() => { navigate("/") }} />
          <img src={logoType} className='max-h-5 cursor-pointer relative dark:hidden' id='logoType' alt="Chatter Logotype" onClick={() => { navigate("/") }} />
          <img src={logoTypeDark} className='max-h-5 cursor-pointer relative hidden dark:block' id='logoType' alt="Chatter Logotype" onClick={() => { navigate("/") }} />
        </div>
        <div className='basis-full justify-end hidden 2xl:flex'>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li><Link to='/' className='dark:!text-yellow'>Home</Link></li>
              <li><Link to='/about' className='dark:!text-yellow'>About</Link></li>
              <li><Link to='/faq' className='dark:!text-yellow'>FAQs</Link></li>
              {user.user === null && <li><Link to='/register' className='dark:!text-yellow'>Register</Link></li>}
              {user.user === null && <li><Link to='/login' className='dark:!text-yellow'>Login</Link></li>}
              <li><ThemeSwitcher /></li>
            </ul>
          </div>
          {user.user !== null && (
            <div className="dropdown dropdown-end">
              <label tabIndex="0" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src={photoURL} />
                </div>
              </label>
              <ul tabIndex="0" className="dropdown-content z-[1] menu p-2 shadow-md bg-neutral-50 rounded-box w-52 dark:bg-darkAccent">
                <li onClick={handleClick}><Link to={`/app`} className='dark:!text-yellow'>Go to App</Link></li>
                <li onClick={handleClick}><Link to='/' onClick={onLogout} className='dark:!text-yellow'>Logout</Link></li>
              </ul>
            </div>
          )}
        </div>
        {/*Mobile Nav*/}
        <div className='basis-full justify-end hidden max-2xl:flex'>
          <div className='flex flex-row gap-0.5 justify-end'>
            <input id="drawer" type="checkbox" className="drawer-toggle drawer-checkbox" />
            <div className="drawer-content">
              <label htmlFor="drawer" className="drawer-button btn bg-pink m-1 text-pureWhite border-none"><i className="fa-solid fa-bars fa-2xl"></i></label>
            </div>
            <div className="drawer-side">
              <label htmlFor="drawer" aria-label="close sidebar" className="drawer-overlay"></label>
              <ul className="menu p-4 w-4/5 min-h-full bg-white text-base-content dark:bg-darkFront">
                {/* Sidebar content here */}
                <li onClick={handleLinkClick}><Link to='/' className="dark:!text-yellow">Home</Link></li>
                <li><Link to='/about' onClick={handleLinkClick} className="dark:!text-yellow">About</Link></li>
                <li><Link to='/faq' onClick={handleLinkClick} className="dark:!text-yellow">FAQs</Link></li>
                {user.user === null && <li onClick={handleLinkClick}><Link to='/register' className="dark:!text-yellow">Register</Link></li>}
                {user.user === null && <li onClick={handleLinkClick}><Link to='/login' className="dark:!text-yellow">Login</Link></li>}
                {user.user !== null && <li onClick={handleClick}><Link to={`/app`} className="dark:!text-yellow">Go to App</Link></li>}
                {user.user !== null && <li onClick={handleLinkClick}><Link to='/' onClick={onLogout} className="dark:!text-yellow">Logout</Link></li>}
                <div className="divider m-0 max-xl:display-flex xl:hidden"></div>
                <li className='flex flex-row items-start max-xl:display-flex xl:hidden'><ThemeSwitcher /></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

NavBar.propTypes = {
  onLogout: PropTypes.func,
};
