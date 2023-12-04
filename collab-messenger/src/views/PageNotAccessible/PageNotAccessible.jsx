import { useLocation, useNavigate } from 'react-router-dom';
import PageNotFoundImage from '../../assets/page-not-found/PageNotFound.svg'
import { useEffect, useState } from 'react';

export default function PageNotAccessible() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState('');


  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  return (
    <div className='flex flex-col items-center gap-5 px-40 max-xl:px-6 py-12 h-full w-full justify-center'>
      <img src={PageNotFoundImage} id='PageNotFound' alt="Page Not Found Illustration" className='max-h-64' />
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold'>Oops, looks like this page is a VIP zone!</h1>
        <p>Wanna join the party? Sign in or register to unlock the fun and get access!</p>
      </div>
      <div className='flex flex-row gap-2'>
        {activeLink.includes('/app') && <button onClick={() => navigate('/register')} className='btn bg-pink border-none text-pureWhite'>Register</button>}
        {activeLink.includes('/app') && <button onClick={() => navigate('/login')} className='btn bg-blue border-none text-pureWhite'>Sign in</button>}
      </div>
    </div>
  )
}
