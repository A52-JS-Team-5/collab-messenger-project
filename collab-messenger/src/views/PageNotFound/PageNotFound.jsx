import { useLocation, useNavigate } from 'react-router-dom';
import PageNotFoundImage from '../../assets/page-not-found/PageNotFound.svg'
import { useEffect, useState } from 'react';

export default function PageNotFound() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeLink, setActiveLink] = useState('');


  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  return (
    <div className='flex flex-col items-center gap-5 px-40 max-xl:px-6 py-12 h-full w-full justify-center'>
      <img src={PageNotFoundImage} id='PageNotFound' alt="Page Not Found Illustration" className='max-h-64' />
      <h1 className='text-3xl font-bold'> Page Not Found </h1>
      <p> We&apos;re sorry, the page you requested could not be found.</p>
      <div className='flex flex-row gap-2'>
        {!activeLink.includes('/app') && <button onClick={() => navigate('/')} className='btn bg-pink border-none text-pureWhite'>Go to to Homepage</button>}
        {activeLink.includes('/app') && <button onClick={() => navigate('/app')} className='btn bg-pink border-none text-pureWhite'>Go to Insights</button>}
      </div>
    </div>
  )
}
