import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';
import icon from '/icon.png'
import AppContext from '../../context/AuthContext';

export default function NavBar({ onLogout }) {
  const navigate = useNavigate();
  const user = useContext(AppContext);
  const [photoURL, setPhotoURL] = useState('https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg')

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
    <nav className='sticky top-4 z-[50]'>
      <div id='navbar' className="navbar rounded-xl flex flex-row shadow-lg">
        <div className="basis-1/4">
          <img src={icon} className='max-h-14' id='icon' alt="Chatter Logo" onClick={() => { navigate("/") }} />
        </div>
        <div className='basis-full justify-end hidden 2xl:flex'>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li><Link to='/'>Home</Link></li>
              <li><Link to='/about'>About</Link></li>
              <li><Link to='/faq'>FAQs</Link></li>
              {user === null && <li><Link to='/register'>Register</Link></li>}
              {user === null && <li><Link to='/login'>Login</Link></li>}
            </ul>
          </div>
          {user !== null && (
            <div className="dropdown dropdown-end">
              <label tabIndex="0" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src={photoURL} />
                </div>
              </label>
              <ul tabIndex="0" className="dropdown-content z-[1] menu p-2 shadow-md bg-neutral-50 rounded-box w-52">
                <li onClick={handleClick}><Link to={`/app`}>Go to App</Link></li>
                <li onClick={handleClick}><Link to='/' onClick={onLogout} >Logout</Link></li>
              </ul>
            </div>
          )}
        </div>
        {/*Mobile Nav*/}
        <div className='basis-full justify-end hidden max-2xl:flex'>
          <div className='flex flex-row gap-0.5 justify-end'>
            <input id="drawer" type="checkbox" className="drawer-toggle drawer-checkbox" />
            <div className="drawer-content">
              <label htmlFor="drawer" className="drawer-button btn btn-primary m-1"><i className="fa-solid fa-bars fa-2xl"></i></label>
            </div>
            <div className="drawer-side">
              <label htmlFor="drawer" aria-label="close sidebar" className="drawer-overlay"></label>
              <ul className="menu p-4 w-4/5 min-h-full bg-base-200 text-base-content">
                {/* Sidebar content here */}
                <li onClick={handleLinkClick}><Link to='/'>Home</Link></li>
                <li><Link to='/about' onClick={handleLinkClick}>About</Link></li>
                <li><Link to='/faq' onClick={handleLinkClick}>FAQs</Link></li>
                {user === null && <li onClick={handleLinkClick}><Link to='/register'>Register</Link></li>}
                {user === null && <li onClick={handleLinkClick}><Link to='/login'>Login</Link></li>}
                {user === null && <li onClick={handleClick}><Link to={`/app`}>Go to App</Link></li>}
                {user !== null && <li onClick={handleLinkClick}><Link to='/' onClick={onLogout}>Logout</Link></li>}
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