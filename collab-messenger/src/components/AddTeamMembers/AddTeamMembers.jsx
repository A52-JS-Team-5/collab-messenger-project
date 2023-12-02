import { useState, useContext, useRef } from 'react';
import AppContext from '../../context/AuthContext';
import { updateTeamMembers } from '../../services/teams.services';
import cn from "classnames";
import { searchUsers } from '../../services/users.services';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createNotification, pushNotifications } from '../../services/notifications.services';
import { ADDED_TO_TEAM_NOTIFICATION, ADDED_TO_TEAM_TYPE } from '../../common/constants';
import PropTypes from 'prop-types';

const AddTeamMembers = ({ teamDetails }) => {
    const user = useContext(AppContext);
    const [open, setOpen] = useState(false);
    const handleToggle = () => setOpen((prev) => !prev);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const inputRef = useRef();

    const modalClass = cn({
        "modal modal-bottom sm:modal-middle": true,
        "modal-open": open,
    });

    const [teamData, setTeamData] = useState({
        members: {},
    });

    const handleAddMember = (userId) => {
        const userToAdd = searchResults.find((user) => user.id === userId);

        if (userToAdd) {
            setTeamData({
                members: {
                    ...teamData.members,
                    [userToAdd.handle]: true,
                },
            });

            setSelectedMembers([...selectedMembers, userToAdd]);
            inputRef.current.value = '';
            handleSearchUsers('');
        }
    };

    const handleRemoveMember = (handle) => {
        const updatedMembers = { ...teamData.members };
        delete updatedMembers[handle];

        const updatedSelectedMembers = selectedMembers.filter((member) => member.handle !== handle);

        setTeamData({
            members: updatedMembers,
        });

        setSelectedMembers(updatedSelectedMembers);
    };

    const handleCancel = () => {
        setOpen(false);
        inputRef.current.value = '';
        setSearchResults([]);
    }

    const handleSaveTeam = () => {
        const membersToAdd = selectedMembers.map((member) => member.handle);

        updateTeamMembers(teamDetails.id, membersToAdd)
            .then(() => {
                toast('Member(s) added successfully.');

                return createNotification(`${ADDED_TO_TEAM_NOTIFICATION}: ${teamDetails.name}.`, ADDED_TO_TEAM_TYPE, teamDetails.id);
            })
            .then((notificationId) =>
                Promise.all(membersToAdd.map((member) =>
                    pushNotifications(member, notificationId))))
            .catch((error) => {
                console.log(error.message);
                toast('An error occurred while trying to add team members.')
            });

        handleToggle();
        inputRef.current.value = '';
        setSearchResults([]);
        setSelectedMembers([]);
    };

    const handleSearchUsers = (query) => {
        if (query.trim() !== "") {
            searchUsers(query)
                .then((filteredUsers) => {
                    const currentUserHandle = user?.userData.handle;
                    const nonTeamMembers = filteredUsers.filter((user) => user.handle !== currentUserHandle && !teamDetails?.members.includes(user.handle.toLowerCase()))

                    setSearchResults(nonTeamMembers);
                })
                .catch((error) => {
                    console.error(error.message);
                });
        } else {
            setSearchResults([]);
        }
    };

    return (
        <div className="add-ream-members-wrapper">
            <button className='btn bg-pink border-none text-pureWhite' onClick={handleToggle}><i className="fa-solid fa-users"></i>Add Members</button>
            <div id="add-team-members-modal" className={modalClass}>
                <div className="modal-box bg-pureWhite">
                    <div className="flex flex-col gap-2">
                        <div>
                            <label className="label">
                                <span className="label-text">Members</span>
                            </label>
                            <div className="scrollable-list-container flex flex-col gap-2">
                                <input type="text" ref={inputRef} onChange={(e) => { handleSearchUsers(e.target.value); }} className="input input-bordered w-full text-black bg-pureWhite" />
                                {/* Display search results */}
                                {searchResults.length > 0 && (
                                    <ul className="scrollable-list max-h-24	overflow-y-auto">
                                        {searchResults.map((user) => (
                                            <li key={user.id} onClick={() => handleAddMember(user.id)} className='cursor-pointer flex flex-row gap-2 items-center hover:bg-pureWhite pt-1 pb-1 pl-2 pr-2'>
                                                <img src={user.photoURL} className='h-8 w-8 rounded-full' />
                                                <div className='flex flex-col items-start self-stretch'>
                                                    <p className='text-sm'>{user.name}{' '}{user.surname}</p>
                                                    <p className='text-xs'>{`@${user.id}`}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        {/* Display selected members */}
                        {selectedMembers.length > 0 && (
                            <div className="selected-members">
                                <ul className='flex flex-wrap gap-2'>
                                    {selectedMembers.map((member) => (
                                        <li key={member.id} className='badge badge-outline gap-2 p-4'>
                                            <img src={member.photoURL} className='h-4 w-4 rounded-full' />
                                            {member.name}{' '}{member.surname}
                                            <i className="fa-solid fa-x cursor-pointer" onClick={() => handleRemoveMember(member.handle)}></i>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="modal-action flex-row">
                        <button className="btn btn-outline border-pink text-pink" onClick={handleCancel}>Cancel</button>
                        <button type="button" onClick={handleSaveTeam} className="btn bg-pink border-none text-pureWhite">Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

AddTeamMembers.propTypes = {
    teamDetails: PropTypes.object,
};

export default AddTeamMembers;