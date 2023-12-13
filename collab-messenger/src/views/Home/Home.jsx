import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AuthContext';
import ChatterHomeHero from '/src/assets/homepage-imgs/chatter-home-hero-1.png';
import ChatterHomeStatistics from '/src/assets/homepage-imgs/chatter-home-statistics.png';
import ChatterHomeFeatureOne from '/src/assets/homepage-imgs/chatter-home-feature-1.png';
import ChatterHomeFeatureTwo from '/src/assets/homepage-imgs/chatter-home-feature-2.png';
import ChatterHomeFeatureThree from '/src/assets/homepage-imgs/chatter-home-feature-3.png';
import ChatterHomeFeatureFour from '/src/assets/homepage-imgs/chatter-home-feature-4.png';
import ChatterHomeFeatureFive from '/src/assets/homepage-imgs/chatter-home-feature-5.png';
import { getUsersCount } from '../../services/users.services';
import { getAllTeamsCount } from '../../services/teams.services';
import { getChatsCount } from '../../services/chats.services';
import { getChannelsCount } from '../../services/channels.services';
import Carousel from '../../components/Carousel/Carousel';
import Gigova from '/src/assets/avatars/gigova.svg';
import Stoykova from '/src/assets/avatars/stoykova.svg';
import Dobrev from '/src/assets/avatars/dobrev.svg';

function Home() {

  const navigate = useNavigate();
  const user = useContext(AppContext);
  const [usersCount, setUsersCount] = useState(0);
  const [teamsCount, setTeamsCount] = useState(0);
  const [channelsCount, setChannelsCount] = useState(0);
  const [chatsCount, setChatsCount] = useState(0);

  useEffect(() => {
    getUsersCount()
      .then(data => {
        setUsersCount(data)
      })
      .catch((e) => {
        console.log(e);
      })

    getAllTeamsCount()
      .then(data => {
        setTeamsCount(data)
      })
      .catch((e) => {
        console.log(e);
      })

    getChatsCount()
      .then(data => {
        setChatsCount(data)
      })
      .catch((e) => {
        console.log(e);
      })

    getChannelsCount()
      .then(data => {
        setChannelsCount(data)
      })
      .catch((e) => {
        console.log(e);
      })
  }, [])

  return (
    <div>
      <div className="hero dark:text-darkText">
        <div className="hero-content my-12 lg:my-24 flex-col-reverse lg:flex-row-reverse gap-8">
          <img src={ChatterHomeHero} />
          <div className='flex flex-col items-start max-lg:items-center max-w-2xl'>
            <h1 className="text-5xl font-bold text-black text-left max-lg:text-center dark:text-darkText">Explore Chatter: Where Every Interaction Sparks Magic!</h1>
            <p className="py-6 text-black text-left max-lg:text-center dark:text-darkText">Welcome to Chatter, the place where seamless conversations meet sleek design and innovative features, creating an experience like no other. Immerse yourself in a world where subtle themes set the tone, a delightful user experience enhances every interaction, and irresistible features steal the hearts of our users.</p>
            {!user?.userData && <div className='space-x-4'>
              <button className="bg-pink text-pureWhite" onClick={() => navigate('/register')}>Register</button>
              <button className="bg-blue text-pureWhite" onClick={() => navigate('/login')}>Login</button>
            </div>}
          </div>
        </div>
      </div>
      <div className="hero bg-white dark:bg-darkFront rounded-3xl">
        <div className="hero-content my-12 lg:my-24 flex-col lg:flex-row-reverse gap-14">
          <div className='flex flex-col items-start max-lg:items-center max-w-2xl gap-4'>
            <div className='flex flex-col items-start'>
              <h2 className="text-5xl font-bold text-black text-left max-lg:text-center dark:text-darkText">Get a Glimpse into Chatter</h2>
              <p className="py-6 text-black text-left max-lg:text-center dark:text-darkText">Engage with a community of active users shaping vibrant conversations, collaborate seamlessly in teams that pulse with innovation, and dive into tailored channels where diverse interests converge. Immerse yourself in lively real-time chats, where every interaction contributes to the magic.</p>
            </div>
            <div className='flex flex-col md:flex-row self-stretch items-center gap-2 md:justify-between'>
              <div className='flex flex-col gap-2'>
                <h1 className='text-5xl font-bold text-pink dark:text-yellow'>{usersCount}</h1>
                <p className='dark:text-darkText'>Users on Board</p>
              </div>
              <div className='flex flex-col gap-2'>
                <h1 className='text-5xl font-bold text-pink dark:text-yellow'>{teamsCount}</h1>
                <p className='dark:text-darkText'>Team Collaborations</p>
              </div>
              <div className='flex flex-col gap-2'>
                <h1 className='text-5xl font-bold text-pink dark:text-yellow'>{channelsCount}</h1>
                <p className='dark:text-darkText'>Tailored Channels</p>
              </div>
              <div className='flex flex-col gap-2'>
                <h1 className='text-5xl font-bold text-pink dark:text-yellow'>{chatsCount}</h1>
                <p className='dark:text-darkText'>Lively Chats</p>
              </div>
            </div>
          </div>
          <img src={ChatterHomeStatistics} />
        </div>
      </div>
      <div className="hero">
        <div className="hero-content my-12 lg:my-24 flex-col-reverse lg:flex-row-reverse gap-14">
          <Carousel slides={[ChatterHomeFeatureOne, ChatterHomeFeatureTwo]} />
          <div className='flex flex-col items-start max-lg:items-center max-w-2xl'>
            <h2 className="text-5xl font-bold text-black text-left max-lg:text-center dark:text-darkText">Features that Elevate Your Chats</h2>
            <p className="py-6 text-black text-left max-lg:text-center dark:text-darkText">Discover the rich set of features that make Chatter a powerhouse of seamless communication:</p>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col items-start max-lg:items-center gap-2'>
                <h2 className="text-lg font-bold text-black text-left max-lg:text-center dark:text-darkText">💬 Dynamic Chats with Multimedia</h2>
                <p className="text-black text-left max-lg:text-center dark:text-darkText">Engage in vibrant conversations with detailed chat information. Share files, express yourself with emojis, and add a dash of fun with GIFs to make your chats truly come alive.</p>
              </div>
              <div className='flex flex-col items-start max-lg:items-center gap-2'>
                <h2 className="text-lg font-bold text-black text-left max-lg:text-center dark:text-darkText">💡 Team Collaboration Made Effortless</h2>
                <p className="text-black text-left max-lg:text-center dark:text-darkText">Organize your projects seamlessly with Teams. Edit team details, update team photos, and manage members and channels effortlessly to foster innovation and creativity.</p>
              </div>
              <div className='flex flex-col items-start max-lg:items-center gap-2'>
                <h2 className="text-lg font-bold text-black text-left max-lg:text-center dark:text-darkText">🔗 Tailored Channels for Every Interest</h2>
                <p className="text-black text-left max-lg:text-center dark:text-darkText">Dive into specialized channels within teams where diverse interests converge. Stay connected with topics that matter most to you and your team.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero bg-white dark:bg-darkFront rounded-3xl">
        <div className="hero-content my-12 lg:my-24 flex-col lg:flex-row-reverse gap-14">
          <div className='flex flex-col items-start max-lg:items-center max-w-2xl'>
            <h2 className="text-5xl font-bold text-black text-left max-lg:text-center dark:text-darkText">Features that Elevate Your Profile</h2>
            <p className="py-6 text-black text-left max-lg:text-center dark:text-darkText">Discover the rich set of features that make Chatter a powerhouse of seamless communication:</p>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col items-start max-lg:items-center max-w-2xl gap-2'>
                <h2 className="text-lg font-bold text-black text-left max-lg:text-center dark:text-darkText">🌐 User Profiles and Customization</h2>
                <p className="text-black text-left max-lg:text-center dark:text-darkText">Tailor your identity with ease. Manage your profile details, update your password, and personalize your photo to make every interaction uniquely yours.</p>
              </div>
              <div className='flex flex-col items-start max-lg:items-center max-w-2xl gap-2'>
                <h2 className="text-lg font-bold text-black text-left max-lg:text-center dark:text-darkText">🎨 Customizable User Status</h2>
                <p className="text-black text-left max-lg:text-center dark:text-darkText">Let others know your availability with customizable statuses. Whether you are available, busy, or away, stay connected and aligned with your team.</p>
              </div>
              <div className='flex flex-col items-start max-lg:items-center max-w-2xl gap-2'>
                <h2 className="text-lg font-bold text-black text-left max-lg:text-center dark:text-darkText">📁 Saved Items for Easy Reference</h2>
                <p className="text-black text-left max-lg:text-center dark:text-darkText">Effortlessly keep track of important messages with Saved Items. Access and revisit your saved messages whenever you need them, ensuring nothing gets lost in the conversation flow.</p>
              </div>
              <div className='flex flex-col items-start max-lg:items-center max-w-2xl gap-2'>
                <h2 className="text-lg font-bold text-black text-left max-lg:text-center dark:text-darkText">🚀 Real-Time Insights and Notifications</h2>
                <p className="text-black text-left max-lg:text-center dark:text-darkText">Stay in the loop with real-time notifications. Get notified when added or removed from a team or channel, ensuring you never miss a beat in your Chatter journey.</p>
              </div>
            </div>
          </div>
          <Carousel slides={[ChatterHomeFeatureThree, ChatterHomeFeatureFour, ChatterHomeFeatureFive]} />
        </div>
      </div>
      <div className="hero">
        <div className="hero-content flex-col my-12 lg:my-24 gap-4 lg:gap-8">
          <div className='flex flex-col items-center max-w-2xl'>
            <h2 className="text-5xl font-bold text-black text-center max-lg:text-center dark:text-darkText">From the Creators</h2>
            <p className="py-6 text-black text-center max-lg:text-center dark:text-darkText">Discover Chatter through the eyes of our dedicated team.</p>
          </div>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            <div className='card bg-white dark:bg-darkAccent gap-4 text-black dark:text-darkText'>
              <p className='text-left'>Chatter is the perfect fusion of design and functionality, a testament to our passion for crafting delightful products. As a Web Designer and Developer, my mission is to create seamless experiences, and Chatter stands as the embodiment of this commitment — where design seamlessly meets functionality.</p>
              <div className='card-body p-0 flex-row items-center'>
                <div className='profile-photo'>
                  <img src={Gigova} className='h-20 w-20 aspect-square rounded-full'></img>
                </div>
                <div className='card-text text-left'>
                  <h2>Teodora Gigova</h2>
                  <p>Chatter Team</p>
                </div>
              </div>
            </div>
            <div className='card bg-white dark:bg-darkAccent gap-4 text-black dark:text-darkText'>
              <p className='text-left'>Being part of the Chatter development team has been an incredible journey. We envisioned a platform that goes beyond just chatting — it is a dynamic space for collaboration. Seeing users embrace the features and elevate their communication inspires us to keep pushing the boundaries of what is possible.</p>
              <div className='card-body p-0 flex-row items-center'>
                <div className='profile-photo'>
                  <img src={Stoykova} className='h-20 w-20 aspect-square rounded-full'></img>
                </div>
                <div className='card-text text-left'>
                  <h2>Silvia Stoykova</h2>
                  <p>Chatter Team</p>
                </div>
              </div>
            </div>
            <div className='card bg-white dark:bg-darkAccent gap-4  text-black dark:text-darkText'>
              <p className='text-left'>From day one, our goal has been clear: creating a platform that connects people and provides real value. Chatter is more than just a project; it is our commitment to seamless chat communication in the digital age. Seeing our vision come to life and surpass expectations is truly thrilling and I am super proud.</p>
              <div className='card-body p-0 flex-row items-center'>
                <div className='profile-photo'>
                  <img src={Dobrev} className='h-20 w-20 aspect-square rounded-full'></img>
                </div>
                <div className='card-text text-left'>
                  <h2>Georgi Dobrev</h2>
                  <p>Chatter Team</p>
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