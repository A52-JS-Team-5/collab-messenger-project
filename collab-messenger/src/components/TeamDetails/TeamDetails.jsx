import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import ManageTeam from '../ManageTeam/ManageTeam';
import TeamMembersList from '../TeamMembersList/TeamMembersList';

const TeamDetails = ({ teamDetails, showManageTeam }) => {
    const [activeTab, setActiveTab] = useState(0); // 0 for Members, 1 for Channels, 2 for Basic Details

    const [teamData, setTeamData] = useState(teamDetails);
    useEffect(() => { setTeamData(teamDetails) }, [teamDetails]);

    const handleTabClick = (tabIndex) => {
        setActiveTab(tabIndex);
    };

    return (
        <div className='flex flex-col basis-4/5 p-4 rounded-md bg-pureWhite gap-8'>
            <div className='flex flex-row gap-4'>
                <img src={teamData?.photoURL} className='w-24 h-24 object-cover rounded-md'></img>
                <div className='flex flex-col gap-0.5 items-start justify-center'>
                    <h2 className='text-lg font-bold'>{teamData?.name}</h2>
                    <p>{teamData?.description}</p>
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
};