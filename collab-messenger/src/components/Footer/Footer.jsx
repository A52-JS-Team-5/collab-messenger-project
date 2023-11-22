import icon from '/iconSmall.png'
import fb from '/fb.png'
import twitter from '/twitter.png'
import instagram from '/insta.png'
import linkedIn from '/linkedIn.png'
import youtube from '/youtube.png'
import { Link } from 'react-router-dom';

export default function Footer() {

  const handleLinkClick = () => {
    // Find the checkbox element and uncheck it
    const checkbox = document.querySelector('.drawer-checkbox');
    if (checkbox) {
      checkbox.checked = false;
    }
  };
  
  return (
    <div className="bottom-0">
      <div className='flex items-center justify-between'>
        <div className="logo">
          <img src={icon} className='w-10' alt="Chatter logo" />
        </div>
        <div className='pl-14 flex flex-rol items-center text-black space-x-4'>
          <ul onClick={handleLinkClick}><Link to='/'>Home</Link></ul>
          <ul onClick={handleLinkClick}><Link to='/about'>About</Link></ul>
          <ul onClick={handleLinkClick}><Link to='/login'>Login</Link></ul>
          <ul onClick={handleLinkClick}><Link to='/register'>Register</Link></ul>
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
      <div className='text-black flex space-x-4 items-center justify-center'>
        <p className="text-black">&copy; Assemble 2023 - All rights reserved</p>
        {/* to add onClick events for the respective pages */}
        <p>Privacy Policy</p> 
        <p>Terms of Service</p>
        <p>Cookie Settings</p>
      </div>
      <br />
    </div>
  )
}
