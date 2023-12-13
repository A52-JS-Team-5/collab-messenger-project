import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react'
import AppContext from '../../context/AuthContext';
import iconLogo from '../../assets/app-icon/app-icon.svg';
import logoType from '../../assets/app-icon/chatter-logotype.svg';
import logoTypeDark from '../../assets/app-icon/chatter-logotype-dark.svg';

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
            <div className='relative card bg-darkBlue flex-col md:flex-row items-center dark:bg-darkAccent overflow-hidden'>
              <div className='text-pureWhite md:w-2/3 p-4 text-black flex flex-col gap-2'>
                <h1 className='text-left max-md:text-center text-4xl font-semibold'>Ready to join Chatter?</h1>
                <p className='text-left max-md:text-center'>Explore a space where every moment sparks creativity and connection.</p>
              </div>
              {!user?.userData && <div className='flex items-center justify-center md:justify-end md:w-1/3 p-4 md:pl-0 md:pr-4'>
                <button className="bg-pink border-none text-pureWhite mr-2" onClick={() => navigate('/register')}>Register</button>
                <button className="bg-blue border-none text-pureWhite" onClick={() => navigate('/login')}>Login</button>
              </div>}
              <div className='absolute bg-pink rounded-full w-20 h-20 bottom-[-48px] left-12'></div>
              <div className='absolute bg-mint rounded-full w-8 h-8 bottom-[-20px] left-28'></div>
              <div className='absolute bg-yellow rounded-full w-20 h-20 top-[-48px] right-12'></div>
              <div className='absolute bg-blue rounded-full w-8 h-8 top-[-20px] right-28'></div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col items-center gap-8 mt-24 mb-6'>
        <div className="flex flex-row items-center gap-2">
          <img src={iconLogo} className='max-h-10 cursor-pointer' id='iconLogo' alt="Chatter Logo" onClick={() => { navigate("/") }} />
          <img src={logoType} className='max-h-5 cursor-pointer relative dark:hidden' id='logoType' alt="Chatter Logotype" onClick={() => { navigate("/") }} />
          <img src={logoTypeDark} className='max-h-5 cursor-pointer relative hidden dark:block' id='logoType' alt="Chatter Logotype" onClick={() => { navigate("/") }} />
        </div>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 xl:gap-12'>
          <ul onClick={handleLinkClick}><Link to='/' className='dark:text-yellow'>Home</Link></ul>
          <ul onClick={handleLinkClick}><Link to='/about' className='dark:text-yellow'>About</Link></ul>
          <ul onClick={handleLinkClick}><Link to='/faq' className='dark:text-yellow'>FAQs</Link></ul>
          <ul onClick={handleLinkClick}><Link to='/login' className='dark:text-yellow'>Login</Link></ul>
          <ul onClick={handleLinkClick}><Link to='/register' className='dark:text-yellow'>Register</Link></ul>
        </div>
        <div className="divider m-0"></div>
        <div className='text-black flex flex-row justify-center dark:text-darkText px-12'>
          <p className="text-black dark:text-darkText">&copy; Chatter 2023. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
