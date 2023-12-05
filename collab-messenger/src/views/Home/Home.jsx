import { useNavigate } from 'react-router-dom';
import image from '/src/assets/placeholderImg.png'
import imageOne from '/src/assets/image1.svg'
import imageTwo from '/src/assets/image2.svg'
import imageThree from '/src/assets/image3.svg'

function Home() {

  const navigate = useNavigate();
    
  return (
    <div>
      <div className="hero my-12 dark:text-darkText">
        <div className="hero-content flex-col lg:flex-row-reverse gap-14">
            <img src={image} className="max-w-md rounded-lg" />
            <div className='flex flex-col items-start max-lg:items-center max-w-2xl'>
                <h1 className="text-5xl font-bold text-black text-left max-lg:text-center dark:text-darkText">Get to know Chatter</h1>
                <p className="py-6 text-black text-left max-lg:text-center dark:text-darkText">Where collaboration feels effortless, offering intuitive communication and customizable channels. Stay connected, work together, and unleash your team&apos;s creativity with Chatter - your go-to platform for smooth collaboration!</p>
                <div className='space-x-4'>
                    <button className="bg-pink text-pureWhite" onClick={() => navigate('/register')}>Register</button>
                    <button className="bg-blue text-pureWhite" onClick={() => navigate('/login')}>Login</button>
                </div>
            </div>
        </div>
      </div>
      <div className="hero my-12 bg-white dark:bg-darkFront">
        <div className="hero-content flex-col lg:flex-row-reverse gap-14">
          <div className='flex flex-col items-start max-lg:items-center max-w-2xl'>
            <h2 className="text-5xl font-bold text-black text-left max-lg:text-center dark:text-darkText">Long heading is what you see here in this feature section</h2>
            <p className="py-6 text-black text-left max-lg:text-center dark:text-darkText">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.</p>
          </div>
          <img src={image} className="max-w-md rounded-lg" />
        </div>
      </div>
      <div className="hero my-12">
        <div className="hero-content flex-col lg:flex-row-reverse gap-14">
          {/* carousel starts from here */}
          <div className='h-96 carousel carousel-vertical rounded-box'>
            <div className='carousel-item h-full'>
              <img src={imageOne}></img>
            </div>
            <div className='carousel-item h-full'>
              <img src={imageTwo}></img>
            </div>
            <div className='carousel-item h-full'>
              <img src={imageThree}></img>
            </div>
          </div>
          {/* carousel ends here */}
          <div className='flex flex-col items-start max-lg:items-center max-w-2xl'>
            <h2 className="text-5xl font-bold text-black text-left max-lg:text-center dark:text-darkText">Long heading is what you see here - Vertical Carousel</h2>
            <p className="py-6 text-black text-left max-lg:text-center dark:text-darkText">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.</p>
          </div>
        </div>
      </div>
      <div className="hero my-12 bg-white dark:bg-darkFront">
        <div className="hero-content flex-col my-12 gap-14">
          <div className='flex flex-col items-center max-w-2xl'>
            <h2 className="text-5xl font-bold text-black text-center max-lg:text-center dark:text-darkText">Customer Testimonials</h2>
            <p className="py-6 text-black text-center max-lg:text-center dark:text-darkText">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-white'>
            <div className='card bg-base-100 dark:bg-darkAccent'>
              <p className='p-4 text-left'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.</p>
              <div className='card-body flex-row items-center'>
                <div className='profile-photo'>
                  <img src={imageOne} className='h-20 rounded-full'></img>
                </div>
                <div className='card-text text-left ml-2'>
                  <h2>Name Surname</h2>
                  <p>Position, Company</p>
                </div>
              </div>
            </div>
            <div className='card bg-base-100 dark:bg-darkAccent'>
              <p className='p-4 text-left'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.</p>
              <div className='card-body flex-row items-center'>
                <div className='profile-photo'>
                  <img src={imageOne} className='h-20 rounded-full'></img>
                </div>
                <div className='card-text text-left ml-2'>
                  <h2>Name Surname</h2>
                  <p>Position, Company</p>
                </div>
              </div>
            </div>
            <div className='card bg-base-100 dark:bg-darkAccent'>
              <p className='p-4 text-left'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.</p>
              <div className='card-body flex-row items-center'>
                <div className='profile-photo'>
                  <img src={imageOne} className='h-20 rounded-full'></img>
                </div>
                <div className='card-text text-left ml-2'>
                  <h2>Name Surname</h2>
                  <p>Position, Company</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
  )
}

export default Home;