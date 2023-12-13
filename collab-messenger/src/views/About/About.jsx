import Carousel from '../../components/Carousel/Carousel'
import ChatterHomeFeatureFive from '/src/assets/homepage-imgs/chatter-home-feature-5.png';
import Gigova from '/src/assets/avatars/gigova.svg';
import Stoykova from '/src/assets/avatars/stoykova.svg';
import Dobrev from '/src/assets/avatars/dobrev.svg';
import GifsterMock from '/src/assets/about-additional/gifster-mock.png';
import AssembleMock from '/src/assets/about-additional/assemble-mock.png';


function About() {

  const handleContactClickSilvia = () => {
    window.open('https://github.com/silviastoykova', '_blank');
  }

  const handleLiContactClickGeorgi = () => {
    window.open('https://www.linkedin.com/in/georgidobrev5/', '_blank');
  }

  const handleGithubContactClickGeorgi = () => {
    window.open('https://github.com/georgidobrev', '_blank');
  }

  const handleLiContactClickTeodora = () => {
    window.open('https://www.linkedin.com/in/teodoragigova/', '_blank');
  }

  const handleGithubContactClickTeodora = () => {
    window.open('https://github.com/teodoragigova', '_blank');
  }

  return (
    <>
      <div className="hero my-12 lg:my-24 py-10">
        <div className="hero-content flex-col lg:flex-row-reverse gap-14">
          <div className='flex flex-col items-center max-w-2xl'>
            <h1 className="text-5xl font-bold text-black text-center max-lg:text-center dark:text-darkText">Our Mission</h1>
            <p className="py-6 text-black text-center max-lg:text-center dark:text-darkText">At Chatter, our mission is to create cool applications that not only look good but also work seamlessly. We are dedicated to enhancing user experiences, ensuring that our applications not only meet but exceed expectations. With a focus on innovation and user-centric design, we aim to make every interaction delightful.</p>
          </div>
        </div>
      </div>
      <div className="hero bg-white dark:bg-darkFront rounded-3xl">
        <div className="hero-content my-12 lg:my-24 flex-col lg:flex-row-reverse gap-8">
          <div className='flex flex-col items-start max-lg:items-center max-w-2xl'>
            <h1 className="text-5xl font-bold text-black text-left max-lg:text-center dark:text-darkText">Our Journey</h1>
            <p className="py-6 text-black text-left max-lg:text-center dark:text-darkText">Formed in October 2023, our team swiftly made an impact with innovative projects like Gifster — a vibrant and dynamic platform powered by Giphy, offering users a visually immersive and entertaining experience in the world of gifs. Additionally, Assemble — a contemporary DIY forum — embodies our commitment to fostering a collaborative space where enthusiasts share ideas, expertise, and creativity.</p>
            <p className="py-6 text-black text-left max-lg:text-center dark:text-darkText">Although diverse in our backgrounds and expertise, we are united by a shared passion for crafting user-centric applications that redefine digital experiences, setting new benchmarks in usability and engagement. This collective vision drives us to continually explore new horizons, pushing the boundaries of what is possible in app development.</p>
          </div>
          <Carousel slides={[ChatterHomeFeatureFive, AssembleMock, GifsterMock]} />
        </div>
      </div>
      <div className="hero my-12 lg:mt-32 lg:mb-12 flex flex-col">
        <div className="hero-content flex-col lg:flex-row-reverse gap-14">
          <h1 className="text-5xl font-bold text-black text-center max-lg:text-center dark:text-darkText">Our Values</h1>
        </div>
        <div className='hero-content grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          <div className='card text-black text-left dark:text-darkText'>
            <h2 className='font-bold text-left max-lg:text-center'>Innovation</h2>
            <p className='text-left max-lg:text-center'>We thrive on innovation, constantly pushing boundaries to create applications that set new standards in the digital realm.</p>
          </div>
          <div className='card text-black text-left dark:text-darkText'>
            <h2 className='font-bold text-left max-lg:text-center'>User-Centric Design</h2>
            <p className='text-left max-lg:text-center'>Users are at the heart of everything we do. We prioritize their needs and experiences, crafting applications that resonate.</p>
          </div>
          <div className='card text-black text-left dark:text-darkText'>
            <h2 className='font-bold text-left max-lg:text-center'>Collaboration</h2>
            <p className='text-left max-lg:text-center'>We believe in the power of collaboration. Together, we create something extraordinary.</p>
          </div>
        </div>
      </div>
      <div className='hero my-12 lg:my-24 flex flex-col'>
        <h2 className="text-5xl font-bold text-black text-left text-center dark:text-darkText">About Us</h2>
        <p className='p-4 text-center max-w-2xl dark:text-darkText'>Meet the minds behind Chatter — a team of three carefully selected individuals by the Telerik Academy team, each bringing a unique set of skills and perspectives.</p>
        <div className='hero-content items-center grid grid-cols-1 gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
          <div className="card bg-white dark:bg-darkAccent items-start">
            <figure className="px">
              <img src={Stoykova} alt="Silvia Stoykova" className="rounded-xl" />
            </figure>
            <div className="items-start text-left pt-5">
              <h2 className="text-lg font-bold text-black pt-2 dark:text-darkText">Silvia Stoykova</h2>
              <p className="text-black font-normal pt-2 dark:text-darkText">Chatter Team</p>
              <p className="text-black font-normal text-start pt-2 dark:text-darkText">Silvia Stoykova, an Expert in the Law field turned Web Developer, seamlessly adds diverse expertise to our team.</p>
            </div>
            <div className='flex flex-row gap-2 other-logos w-4 pt-4'>
              <button className='btn btn-icon btn-sm bg-pink border-none text-pureWhite' onClick={handleContactClickSilvia}><i className="fa-brands fa-github"></i></button>
            </div>
          </div>
          <div className="card bg-white dark:bg-darkAccent items-start">
            <figure className="px">
              <img src={Dobrev} alt="Georgi Dobrev" className="rounded-xl" />
            </figure>
            <div className="items-start text-left pt-5">
              <h2 className="text-lg font-bold text-black pt-2 dark:text-darkText">Georgi Dobrev</h2>
              <p className="text-black font-normal pt-2 dark:text-darkText">Chatter Team</p>
              <p className="text-black font-normal text-start pt-2 dark:text-darkText">Former Reporting Analyst turned Web Developer, Georgi combines analytical skills with a passion for web development.</p>
            </div>
            <div className='flex flex-row gap-2 other-logos w-4 pt-4'>
              <button className='btn btn-icon btn-sm bg-pink border-none text-pureWhite' onClick={handleLiContactClickGeorgi}><i className="fa-brands fa-linkedin-in"></i></button>
              <button className='btn btn-icon btn-sm bg-pink border-none text-pureWhite' onClick={handleGithubContactClickGeorgi}><i className="fa-brands fa-github"></i></button>
            </div>
          </div>
          <div className="card bg-white dark:bg-darkAccent items-start">
            <figure className="px">
              <img src={Gigova} alt="Teodora Gigova" className="rounded-xl" />
            </figure>
            <div className="items-start text-left pt-5">
              <h2 className="text-lg font-bold pt-2 dark:text-darkText">Teodora Gigova</h2>
              <p className="text-black font-normal pt-2 dark:text-darkText">Chatter Team</p>
              <p className="text-black font-normal text-start pt-2 dark:text-darkText">Teodora Gigova, a Web Designer on the path to becoming a developer, brings a creative flair to our projects.</p>
            </div>
            <div className='flex flex-row gap-2 other-logos w-4 pt-4'>
              <button className='btn btn-icon btn-sm bg-pink border-none text-pureWhite' onClick={handleLiContactClickTeodora}><i className="fa-brands fa-linkedin-in"></i></button>
              <button className='btn btn-icon btn-sm bg-pink border-none text-pureWhite' onClick={handleGithubContactClickTeodora}><i className="fa-brands fa-github"></i></button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default About;