import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import ManageTeam from '../ManageTeam/ManageTeam';
import TeamMembersList from '../TeamMembersList/TeamMembersList';

const TeamDetails = ({ teamDetails, showManageTeam, onClick }) => {
    const [activeTab, setActiveTab] = useState(0); // 0 for Members, 1 for Channels, 2 for Basic Details

    const [teamData, setTeamData] = useState(teamDetails);
    useEffect(() => { setTeamData(teamDetails) }, [teamDetails]);

    const handleTabClick = (tabIndex) => {
        setActiveTab(tabIndex);
    };

    return (
        <div className='flex flex-col items-stretch basis-4/5 p-4 rounded-md bg-pureWhite gap-8 max-[1224px]:!basis-full dark:bg-darkFront dark:text-darkText'>
            <div className='flex flex-row items-center min-[1224px]:hidden'>
                <i className="fa-solid fa-chevron-left fa-xs"></i>
                <div className='flex flex-col items-start btn btn-link pl-1 pr-1 pt-0 pb-0 mt-0 mb-0' onClick={onClick}>Return To Team</div>
            </div>
            <div className='flex flex-row gap-4'>
                <img src={teamData?.photoURL} className='w-24 h-24 object-cover rounded-md'></img>
                <div className='flex flex-col gap-0.5 items-start justify-center'>
                    <h2 className='text-lg font-bold'>{teamData?.name}</h2>
                    <p className="text-left">{teamData?.description}</p>
                </div>
            </div>
            <div className='flex flex-col gap-6'>
                <div role="tablist" className="tabs tabs-bordered max-sm:block">
                    <a role="tab" className={`tab max-sm:block ${activeTab === 0 && 'tab-active'}`} onClick={() => handleTabClick(0)}>Members</a>
                    <a role="tab" className={`tab max-sm:block ${activeTab === 1 && 'tab-active'}`} onClick={() => handleTabClick(1)}>Channels</a>
                    {showManageTeam && <a role="tab" className={`tab max-sm:block ${activeTab === 2 && 'tab-active'}`} onClick={() => handleTabClick(2)}>Basic Details</a>}
                </div>
                {activeTab === 0 && <TeamMembersList teamDetails={teamData} showManageTeam={showManageTeam} />}
                {activeTab === 1 && <p>Channels</p>}
                {activeTab === 2 && showManageTeam && <ManageTeam teamDetails={teamData} />}
            </div>
        </div>
    )
};

export default TeamDetails;

TeamDetails.propTypes = {
    teamDetails: PropTypes.object,
    showManageTeam: PropTypes.bool,
    onClick: PropTypes.func
};