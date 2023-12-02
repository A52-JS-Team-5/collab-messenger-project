import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { getUserByHandle } from '../../services/users.services';
import AddTeamMembers from '../AddTeamMembers/AddTeamMembers';
import RemoveTeamMember from '../RemoveTeamMember/RemoveTeamMember';
import UserProfile from '../../views/UserProfile/UserProfile';

const TeamMembersList = ({ teamDetails, showManageTeam }) => {
    const [memberDetails, setMemberDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [teamData, setTeamData] = useState(teamDetails);
    useEffect(() => { setTeamData(teamDetails) }, [teamDetails]);

    // State for search functionality
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {

        const fetchMemberDetails = () => {
            if (teamData.members) {
                const memberPromises = teamData.members.map((memberId) =>
                    getUserByHandle(memberId)
                        .then((snapshot) => {
                            const userData = snapshot;
                            return { id: memberId, ...userData };
                        })
                        .catch((error) => {
                            console.error(`Error fetching user ${memberId}: ${error.message}`);
                            return null;
                        })
                );

                Promise.all(memberPromises)
                    .then((userDetailsArray) => {
                        const filteredUserDetails = userDetailsArray.filter((user) => user !== null);
                        setMemberDetails([...filteredUserDetails]);

                        setLoading(false);
                    })
                    .catch((error) => console.error(`Error fetching member details: ${error.message}`));
            }
        };

        fetchMemberDetails();
    }, [teamData.members]);

    // Filter members based on the search query
    const filteredMembers = memberDetails.filter((member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.handle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // State for the currently opened user profile modal
    const [openUserProfileModal, setOpenUserProfileModal] = useState('');

    // Function to open user profile modal for a specific user
    const handleOpenUserProfileModal = (userHandle) => {
        setOpenUserProfileModal(userHandle);
    };

    // Function to close user profile modal
    const handleCloseUserProfileModal = () => {
        setOpenUserProfileModal(false);
    };

    return (
        !loading && (
            <div className='flex flex-col bg-white rounded-md pt-4'>
                <div className='flex flex-row justify-between items-center pl-4 pr-4'>
                    <input type="text" placeholder="Search members" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='input input-bordered text-black bg-white' />
                    {showManageTeam && <AddTeamMembers teamDetails={teamDetails} />}
                </div>
                {searchQuery === '' ? (
                    <div className='mt-2'>
                        <div tabIndex={0} className="collapse collapse-arrow text-left">
                            <input type="checkbox" />
                            <div className="collapse-title text-md font-medium">
                                Team Owner
                            </div>
                            <div className="collapse-content">
                                <ul>
                                    {memberDetails
                                        .filter((member) => member.handle === teamData.owner)
                                        .map((member) => (
                                            <li key={member.id} className='flex flex-row justify-between p-2 rounded-md items-center cursor-pointer hover:bg-pureWhite'>
                                                <div className='flex flex-row gap-2' onClick={() => handleOpenUserProfileModal(member.handle)}>
                                                    <img src={member.photoURL} className='h-8 w-8 rounded-full' alt={`User ${member.name}`} />
                                                    <div className='flex flex-col items-start'>
                                                        <p className='text-sm'>{member.name} {member.surname}</p>
                                                        <p className='text-xs'>{`@${member.handle}`}</p>
                                                    </div>
                                                </div>
                                                {openUserProfileModal === member.handle && <UserProfile userHandle={member.handle} isOpen={true} onClose={handleCloseUserProfileModal} />}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </div>
                        <div tabIndex={0} className="collapse collapse-arrow text-left">
                            <input type="checkbox" />
                            <div className="collapse-title text-md font-medium">
                                Team Members
                            </div>
                            <div className="collapse-content">
                                <ul>
                                    {memberDetails.length === 1 && (
                                        <div className='flex flex-col items-center'>
                                            <p>There are no other participants in this team yet.</p>
                                        </div>
                                    )}
                                    {memberDetails
                                        .filter((member) => member.handle !== teamData.owner) // Exclude owner from the list
                                        .map((member) => (
                                            <li key={member.id} className='flex flex-row justify-between p-2 rounded-md items-center cursor-pointer hover:bg-pureWhite'>
                                                <div className='flex flex-row gap-2' onClick={() => handleOpenUserProfileModal(member.handle)}>
                                                    <img src={member.photoURL} className='h-8 w-8 rounded-full' alt={`User ${member.name}`} />
                                                    <div className='flex flex-col items-start'>
                                                        <p className='text-sm'>{member.name} {member.surname}</p>
                                                        <p className='text-xs'>{`@${member.handle}`}</p>
                                                    </div>
                                                </div>
                                                {openUserProfileModal === member.handle && <UserProfile userHandle={member.handle} isOpen={true} onClose={handleCloseUserProfileModal} />}
                                                {showManageTeam && <RemoveTeamMember teamId={teamData.id} teamName={teamData.name} memberId={member.id} />}
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-col bg-white rounded-md pt-4 mt-2'>
                        <div className='flex flex-col gap-2'>
                            {/* Simple list of filtered members */}
                            <ul className='pl-4 pr-4 mt-'>
                                {filteredMembers.map((member) => (
                                    <li key={member.id} className='flex flex-row justify-between p-2 rounded-md items-center cursor-pointer hover:bg-pureWhite'>
                                        <div className='flex flex-row gap-2' onClick={() => handleOpenUserProfileModal(member.handle)}>
                                            <img src={member.photoURL} className='h-8 w-8 rounded-full' alt={`User ${member.name}`} />
                                            <div className='flex flex-col items-start'>
                                                <p className='text-sm'>{member.name} {member.surname}</p>
                                                <p className='text-xs'>{`@${member.handle}`}</p>
                                            </div>
                                        </div>
                                        {openUserProfileModal === member.handle && (<UserProfile userHandle={member.handle} isOpen={true} onClose={handleCloseUserProfileModal} />)}
                                        {showManageTeam && member.id !== teamData.owner && <RemoveTeamMember teamId={teamData.id} teamName={teamData.name} memberId={member.id} />}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        )
    )
};

export default TeamMembersList;

TeamMembersList.propTypes = {
    teamDetails: PropTypes.object,
    showManageTeam: PropTypes.bool,
};