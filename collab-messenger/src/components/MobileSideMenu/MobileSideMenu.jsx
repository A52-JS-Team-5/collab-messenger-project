import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const MobileSideMenu = () => {
    const [activeLink, setActiveLink] = useState('');
    const navigate = useNavigate();   
    const location = useLocation();

    useEffect(() => {
        setActiveLink(location.pathname);
    }, [location.pathname]);

    const handleLinkClick = (link) => {
        navigate(link);
    };

    return (
        <div className="fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-lightBlue rounded-full bottom-4 left-1/2 xl:hidden sm:max-xl:display-block">
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