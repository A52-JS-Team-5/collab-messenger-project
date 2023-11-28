import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const MobileSideMenu = () => {
    const [activeLink, setActiveLink] = useState('');
    const navigate = useNavigate();

    const handleLinkClick = (link) => {
        setActiveLink(link);
        navigate(link);
    };

    return (
        <div className="fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-lightBlue rounded-full bottom-4 left-1/2 lg:hidden sm:max-lg:display-block">
            {/*
        <div className="btm-nav btm-nav-lg md:hidden bg-lightBlue sm:max-md:display-block">
            <button onClick={() => handleLinkClick('/app')} className={`bg-lightBlue border-lightBlue text-blue ${activeLink === '/app' ? 'active' : 'hover:!text-blue hover:bg-lightBlue focus:!bg-blue30'}`}>
                    <i className="fa-solid fa-house"></i>
                    <p className='text-xs'>Insights</p>

            </button>
            <button onClick={() => handleLinkClick('/app/chats')} className={`bg-lightBlue border-lightBlue text-blue ${activeLink === '/app/chats' ? 'active' : 'hover:!text-blue hover:bg-lightBlue focus:!bg-blue30'}`}>
                    <i className="fa-solid fa-message"></i>
                    <p className='text-xs'>Chats</p>
            </button>
            <button onClick={() => handleLinkClick('/app/teams')} className={`bg-lightBlue border-lightBlue text-blue ${activeLink === '/app/teams' ? 'active' : 'hover:!text-blue hover:bg-lightBlue focus:!bg-blue30'}`}>
                    <i className="fa-solid fa-users"></i>
                    <p className='text-xs'>Teams</p>
            </button>
        </div>
    */}
            <div className="grid h-full grid-cols-3">
                <button onClick={() => handleLinkClick('/app')} type="button" className={`${activeLink === '/app' && 'bg-blue text-white'} inline-flex flex-col items-center justify-center px-5 rounded-s-full hover:bg-gray-50 group text-blue`}>
                    <i className="fa-solid fa-house"></i>
                    <span className="sr-only">Insights</span>
                </button>
                <button onClick={() => handleLinkClick('/app/chats')} type="button" className={`${activeLink === '/app/chats' && 'bg-blue text-white'} inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group text-blue`}>
                    <i className="fa-solid fa-message"></i>
                    <span className="sr-only">Chats</span>
                </button>
                <button onClick={() => handleLinkClick('/app/teams')} type="button" className={`${activeLink === '/app/teams' && 'bg-blue text-white'} inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-gray-50 group text-blue`}>
                    <i className="fa-solid fa-users"></i>
                    <span className="sr-only">Teams</span>
                </button>
            </div>
        </div>

    )
}

export default MobileSideMenu