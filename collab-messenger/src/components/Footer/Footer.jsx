import icon from '/iconSmall.png'
import fb from '/fb.png'
import twitter from '/twitter.png'
import instagram from '/insta.png'
import linkedIn from '/linkedIn.png'
import youtube from '/youtube.png'
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react'
import AppContext from '../../context/AuthContext'

export default function Footer() {

  const navigate = useNavigate();
  const user = useContext(AppContext);

  const handleLinkClick = () => {
    // Find the checkbox element and uncheck it
    const checkbox = document.querySelector('.drawer-checkbox');
    if (checkbox) {
      checkbox.checked = false;
    }
  };
  
  return (
    <div className="bottom-0">
      <div className="hero my-8">
        <div className="hero-content flex-col w-full">
          <div className='w-full'>
            <div className='card bg-base-100 flex-col md:flex-row items-center justify-between dark:bg-darkAccent'>
              <div className='text md:w-2/3 p-4 text-white'>
                <h1 className='text-left'>Medium length heading</h1>
                <p className='text-left'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. </p>
              </div>
              {!user && <div className='flex items-center justify-center md:justify-end md:w-1/3 p-4 md:pl-0 md:pr-4'>
              <button className="bg-pink text-pureWhite mr-2" onClick={() => navigate('/register')}>Register</button>
              <button className="bg-blue text-pureWhite" onClick={() => navigate('/login')}>Login</button>
            </div>}
          </div>
        </div>
      </div>
    </div>
      <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
        <div className="logo">
          <img src={icon} className='w-10' alt="Chatter logo" />
        </div>
        <div className='pl-14 flex flex-col md:flex-row md:items-center text-black space-y-4 md:space-y-0 md:space-x-4'>
          <ul onClick={handleLinkClick}><Link to='/' className='dark:text-yellow'>Home</Link></ul>
          <ul onClick={handleLinkClick}><Link to='/about' className='dark:text-yellow'>About</Link></ul>
          <ul onClick={handleLinkClick}><Link to='/faq' className='dark:text-yellow'>FAQs</Link></ul>
          <ul onClick={handleLinkClick}><Link to='/login' className='dark:text-yellow'>Login</Link></ul>
          <ul onClick={handleLinkClick}><Link to='/register' className='dark:text-yellow'>Register</Link></ul>
        </div>
        <div className='flex space-x-2 other-logos'>
          <img src={fb} alt="Facebook logo" />
          <img src={instagram} alt="Instagram logo" />
          <img src={twitter} alt="Twitter logo" />
          <img src={linkedIn} alt="LinkedIn logo" />
          <img src={youtube} alt="YouTube logo" />
        </div>
      </div>
      <br />
      <hr className="text-black"/>
      <br />
      <div className='text-black flex flex-col md:flex-row md:items-center md:justify-center space-y-2 md:space-y-0 md:space-x-4 dark:text-darkText'>
        <p className="text-black dark:text-darkText">&copy; Assemble 2023 - All rights reserved</p>
        {/* to add onClick events for the respective pages */}
        <p>Privacy Policy</p> 
        <p>Terms of Service</p>
        <p>Cookie Settings</p>
      </div>
      <br />
    </div>
  )
}
