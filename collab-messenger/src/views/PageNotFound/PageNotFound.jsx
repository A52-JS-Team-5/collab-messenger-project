import { useNavigate } from 'react-router-dom';
import PageNotFoundImage from '../../assets/page-not-found/PageNotFound.png'

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center gap-5 px-40 max-xl:px-6 py-12'>
      <img src={PageNotFoundImage} id='PageNotFound' alt="Page Not Found Illustration" width={200} />
      <h1> Page Not Found </h1>
      <p> We&apos;re sorry, the page you requested could not be found.</p>
      <button onClick={() => navigate('/')}>Return to Homepage</button>
    </div>
  )
}
