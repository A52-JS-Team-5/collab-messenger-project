import { Link, useLocation, useNavigate } from 'react-router-dom';
import iconLogo from '../../assets/app-icon/app-icon.svg'
import { useEffect, useState } from 'react';
import './SideMenu.css';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';

const SideMenu = () => {
    const [activeLink, setActiveLink] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setActiveLink(location.pathname);
    }, [location.pathname]);

    return (
        <div className='flex flex-col max-xl:hidden xl:display-flex xl:display-flex-col pb-4'>
            <img src={iconLogo} className='max-h-14 cursor-pointer' alt="Chatter App Logo" onClick={() => { navigate("/") }} />
            <ul className="menu gap-2 rounded-box justify-center grow">
                <li>
                    <Link to="/app" className={`flex flex-col gap-2 h-20 justify-center !text-blue dark:!text-yellow ${activeLink === '/app' ? '!bg-lightBlue dark:!bg-darkFront dark:!"text-yellow' : 'hover:!text-blue hover:!bg-lightBlue focus:!bg-blue30 dark:hover:!text-yellow dark:hover:!bg-darkFront dark:focus:!bg-darkAccent'}`}>
                        <i className="fa-solid fa-house"></i>
                        <p className='text-xs'>Insights</p>
                    </Link>
                </li>
                <li>
                    <Link to="/app/chats" className={`flex flex-col gap-2 h-20 justify-center !text-blue dark:!text-yellow ${activeLink.includes('/app/chats') ? 'dark:!bg-darkFront dark:!"text-yellow' : 'hover:!text-blue hover:!bg-lightBlue focus:!bg-blue30 dark:hover:!text-yellow dark:hover:!bg-darkFront dark:focus:!bg-darkAccent'}`}>
                        <i className="fa-solid fa-message"></i>
                        <p className='text-xs'>Chats</p>
                    </Link>
                </li>
                <li>
                    <Link to="/app/teams" className={`flex flex-col gap-2 h-20 justify-center !text-blue dark:!text-yellow ${activeLink.includes('/app/teams') ? 'dark:!bg-darkFront dark:!"text-yellow' : 'hover:!text-blue hover:!bg-lightBlue focus:!bg-blue30 dark:hover:!text-yellow dark:hover:!bg-darkFront dark:focus:!bg-darkAccent'}`}>
                        <i className="fa-solid fa-users"></i>
                        <p className='text-xs'>Teams</p>
                    </Link>
                </li>
            </ul>
            <ThemeSwitcher />
        </div>
    )
}

export default SideMenu;