import image from '/src/assets/placeholderImg.png'
import twitter from '/twitter.png'
import linkedIn from '/linkedIn.png'
import dribble from '/dribble.png'

function About() {

//   const handleContactClickSilvia = () => {
//     window.open('https://github.com/silviastoykova', '_blank');
//   }

// const handleContactClickGeorgi = () => {
//     window.open('https://www.linkedin.com/in/georgidobrev5/', '_blank');
//   }

// const handleContactClickTedi = () => {
//     window.open('https://www.linkedin.com/in/teodoragigova/', '_blank');
//   }

  return (
    <>
      <div className="hero my-12 py-10 bg-grey">
        <div className="hero-content flex-col lg:flex-row-reverse gap-14">
            <div className='flex flex-col items-start max-lg:items-center max-w-2xl'>
                <h1 className="text-5xl font-bold text-black text-center max-lg:text-center">Describe why your company exists [mission statement]</h1>
                <p className="py-6 text-black text-center max-lg:text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.</p>
            </div>
        </div>
      </div>
      <div className="hero my-12 py-10 bg-white">
        <div className="hero-content flex-col lg:flex-row-reverse gap-14">
            <img src={image} className="max-w-md rounded-lg" />
            <div className='flex flex-col items-start max-lg:items-center max-w-2xl'>
              <h1 className="text-5xl font-bold text-black text-left max-lg:text-center">About [company name]</h1>
              <p className="py-6 text-black text-left max-lg:text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce varius faucibus massa sollicitudin amet augue. Nibh metus a semper purus mauris duis. Lorem eu neque, tristique quis duis. Nibh scelerisque ac adipiscing velit non nulla in amet pellentesque. Sit turpis pretium eget maecenas. Vestibulum dolor mattis consectetur eget commodo vitae.</p>
              <p className="py-6 text-black text-left max-lg:text-center">Amet pellentesque sit pulvinar lorem mi a, euismod risus rhoncus. Elementum ullamcorper nec, habitasse vulputate. Eget dictum quis est sed egestas tellus, a lectus. Quam ullamcorper in fringilla arcu aliquet fames arcu.Lacinia eget faucibus urna, nam risus nec elementum cras porta. Sed elementum, sed dolor purus dolor dui. Ut dictum nulla pulvinar vulputate sit sagittis in eleifend dignissim. Natoque mauris cras molestie velit. Maecenas eget adipiscing quisque viverra lectus arcu, tincidunt ultrices pellentesque.</p>
            </div>
          </div>
        </div>
        <div className="hero my-8 pt-10 bg-grey">
          <div className="hero-content flex-col lg:flex-row-reverse gap-14">
            <div className='flex flex-col items-start max-lg:items-center max-w-2xl'>
              <h1 className="text-5xl font-bold text-black text-center max-lg:text-center">Emphasize what&apos;s important to your company</h1>
              <p className="py-6 text-black text-center max-lg:text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.</p>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            <div className='card text-black'>
              <h2 className='font-bold'>Highlight Value One</h2>
              <p className='p-4 text-center'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.</p>
            </div>
            <div className='card text-black'>
              <h2 className='font-bold'>Highlight Value Two</h2>
              <p className='p-4 text-center'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.</p>
            </div>
            <div className='card text-black'>
              <h2 className='font-bold'>Highlight Value Three</h2>
              <p className='p-4 text-center'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.</p>
            </div>
        </div>
        <div className='p-10 bg-white'>
                <p className='text-4xl font-bold text-black pb-10'>Get to know the creators</p>
                <div className='flex gap-6 justify-center max-md:flex-col'>
                    <div className="card max-w-xs bg-grey">
                        <figure className="px">
                            <img src={image} alt="Silvia Stoykova" className="rounded-xl" />
                        </figure>
                        <div className="items-start text-center pt-5">
                            <h2 className="card-title text-black pt-2">Silvia Stoykova</h2>
                            <p className="card-title text-black font-normal pt-2">Job Title</p>
                            <p className="card-title text-black font-normal text-start pt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.</p>
                        </div>
                        <div className='flex space-x-4 other-logos w-4 pt-4'>
                          <img src={linkedIn} alt="LinkedIn logo" />
                          <img src={twitter} alt="Twitter logo" />
                          <img src={dribble} alt="Dribbble logo" />
                        </div>
                    </div>
                    <div className="card max-w-xs bg-grey">
                        <figure className="px">
                            <img src={image} alt="Georgi Dobrev" className="rounded-xl" />
                        </figure>
                        <div className="items-start text-center pt-5">
                            <h2 className="card-title text-black pt-2">Georgi Dobrev</h2>
                            <p className="card-title text-black font-normal pt-2">Job Title</p>
                            <p className="card-title text-black font-normal text-start pt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.</p>
                        </div>
                        <div className='flex space-x-4 other-logos w-4 pt-4'>
                          <img src={linkedIn} alt="LinkedIn logo" />
                          <img src={twitter} alt="Twitter logo" />
                          <img src={dribble} alt="Dribbble logo" />
                        </div>
                    </div>
                    <div className="card max-w-xs bg-grey">
                        <figure className="px">
                            <img src={image} alt="Teodora Gigova" className="rounded-xl" />
                        </figure>
                        <div className="items-start text-center pt-5">
                            <h2 className="card-title text-black pt-2">Teodora Gigova</h2>
                            <p className="card-title text-black font-normal pt-2">Job Title</p>
                            <p className="card-title text-black font-normal text-start pt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.</p>
                        </div>
                        <div className='flex space-x-4 other-logos w-4 pt-4'>
                          <img src={linkedIn} alt="LinkedIn logo" />
                          <img src={twitter} alt="Twitter logo" />
                          <img src={dribble} alt="Dribbble logo" />
                        </div>
                    </div>
                </div>
            </div>
    </>
  )
}

export default About;