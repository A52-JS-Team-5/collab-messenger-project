import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserByHandle } from '../../services/users.services';
import AddTeamMembers from '../AddTeamMembers/AddTeamMembers';
import RemoveTeamMember from '../RemoveTeamMember/RemoveTeamMember';

const TeamMembersList = ({ teamDetails, showManageTeam }) => {
    const navigate = useNavigate();
    const [memberDetails, setMemberDetails] = useState([]);
    const [owner, setOwner] = useState(null);
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
                            const userData = snapshot.val();
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

                        const ownerData = userDetailsArray.find((user) => user.id === teamData?.owner);
                        setOwner(ownerData);

                        setLoading(false);
                    })
                    .catch((error) => console.error(`Error fetching member details: ${error.message}`));
            }
        };

        fetchMemberDetails();
    }, [teamData]);

    // Filter members based on the search query
    const filteredMembers = memberDetails.filter((member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.handle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        !loading && (
            <div className='flex flex-col bg-white rounded-md pt-4'>
                <div className='flex flex-row justify-between items-center pl-4 pr-4'>
                    <input type="text" placeholder="Search members" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='input input-bordered text-black bg-white' />
                    {showManageTeam && <AddTeamMembers teamName={teamData.name} />}
                </div>
                {searchQuery === '' ? (
                    <div className='mt-2'>
                        <div tabIndex={0} className="collapse collapse-arrow text-left">
                            <input type="checkbox" />
                            <div className="collapse-title text-md font-medium">
                                Team Owner
                            </div>
                            <div className="collapse-content">
                                <li key={owner.id} className='flex flex-row gap-2 p-2 rounded-md items-center cursor-pointer hover:bg-pureWhite' onClick={() => navigate(`/app/users/${owner.id}`)}>
                                    <img src={owner.photoURL} className='h-8 w-8 rounded-full' alt={`User ${owner.name}`} />
                                    <div className='flex flex-col items-start'>
                                        <p className='text-sm'>{owner.name} {owner.surname}</p>
                                        <p className='text-xs'>{`@${owner.handle}`}</p>
                                    </div>
                                </li>
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
                                        .filter((member) => member.id !== teamData.owner) // Exclude owner from the list
                                        .map((member) => (
                                            <li key={member.id} className='flex flex-row justify-between p-2 rounded-md items-center cursor-pointer hover:bg-pureWhite'>
                                                <div className='flex flex-row gap-2' onClick={() => navigate(`/app/users/${member.id}`)}>
                                                    <img src={member.photoURL} className='h-8 w-8 rounded-full' alt={`User ${member.name}`} />
                                                    <div className='flex flex-col items-start'>
                                                        <p className='text-sm'>{member.name} {member.surname}</p>
                                                        <p className='text-xs'>{`@${member.handle}`}</p>
                                                    </div>
                                                </div>
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
                                        <div className='flex flex-row gap-2' onClick={() => navigate(`/app/users/${member.id}`)}>
                                            <img src={member.photoURL} className='h-8 w-8 rounded-full' alt={`User ${member.name}`} />
                                            <div className='flex flex-col items-start'>
                                                <p className='text-sm'>{member.name} {member.surname}</p>
                                                <p className='text-xs'>{`@${member.handle}`}</p>
                                            </div>
                                        </div>
                                        {showManageTeam && <RemoveTeamMember teamId={teamData.id} teamName={teamData.name} memberId={member.id} />}
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