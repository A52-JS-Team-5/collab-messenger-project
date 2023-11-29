import { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../../context/AuthContext';
import { MIN_TEAM_NAME_LENGTH, MAX_TEAM_NAME_LENGTH, ADDED_TO_TEAM_NOTIFICATION, ADDED_TO_TEAM_TYPE } from '../../common/constants';
import { addTeam, createTeam, getTeamByName, updateTeamMembers } from '../../services/teams.services';
import cn from "classnames";
import { searchUsers } from '../../services/users.services';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createNotification, pushNotifications } from '../../services/notifications.services';

export default function CreateTeam() {
    const user = useContext(AppContext);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const handleToggle = () => setOpen((prev) => !prev);
    const [searchResults, setSearchResults] = useState([]);
    const [formErrorMsg, setFormErrorMsg] = useState({});
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [newTeamId, setNewTeamId] = useState('');
    const inputRef = useRef();

    const modalClass = cn({
        "modal modal-bottom sm:modal-middle": true,
        "modal-open": open,
    });

    const [teamData, setTeamData] = useState({
        name: '',
        description: '',
        members: {},
    });

    const [step, setStep] = useState(1);

    const updateTeamData = (field) => (value) => {
        setTeamData({
            ...teamData,
            [field]: value,
        });
    };

    const validateFormInput = (teamData) => {
        const errors = {};

        if (!teamData.name) {
            errors.name = `Team name is required.`
        } else if (teamData.name.length < MIN_TEAM_NAME_LENGTH || teamData.name.length > MAX_TEAM_NAME_LENGTH) {
            errors.name = `Team name must be between ${MIN_TEAM_NAME_LENGTH} and ${MAX_TEAM_NAME_LENGTH} characters.`
        }

        setFormErrorMsg(errors);
        return errors;
    }

    const handleNextStep = () => {
        if (step === 1) {
            const validationResult = validateFormInput(teamData);

            if (Object.keys(validationResult).length !== 0) {
                return;
            }
        }

        getTeamByName(teamData.name)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    toast(`Team name is already taken. Please choose a different name.`);
                    throw new Error(`Team name is already taken.`);
                }

                return createTeam(teamData.name, teamData.description, user.userData.handle, [], []);
            })
            .then((teamId) => {
                addTeam(user.userData.handle, teamId);
                setNewTeamId(teamId);
                setStep(step + 1);
            })
            .catch((error) => {
                console.log(error.message);
                toast('An error occurred while trying to create the team.')
            });
    };

    const handleAddMember = (userId) => {
        const userToAdd = searchResults.find((user) => user.id === userId);

        if (userToAdd) {
            setTeamData({
                ...teamData,
                members: {
                    ...teamData.members,
                    [userToAdd.handle]: userToAdd.name,
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
            ...teamData,
            members: updatedMembers,
        });

        setSelectedMembers(updatedSelectedMembers);
    };

    const handleSaveTeam = () => {
        const membersToAdd = selectedMembers.map((member) => member.handle);

        updateTeamMembers(newTeamId, membersToAdd)
            .then(() => {
                return createNotification(`${ADDED_TO_TEAM_NOTIFICATION}: ${teamData.name}.`, ADDED_TO_TEAM_TYPE, newTeamId)
            })
            .then((notificationId) =>
                Promise.all(membersToAdd.map((member) =>
                    pushNotifications(member, notificationId))))

            .then(() => {
                navigate(`/app/teams/${newTeamId}`);
            })
            .catch((error) => {
                console.log(error.message);
                toast('An error occurred while trying to add team members.')
            });
    };

    const handleSearchUsers = (query) => {
        if (query.trim() !== "") {
            searchUsers(query)
                .then((filteredUsers) => {
                    const currentUserHandle = user.userData && user.userData.handle;
                    const nonTeamMembers = filteredUsers.filter(user => user.id !== currentUserHandle && !teamData.members[user.id]);
                    setSearchResults(nonTeamMembers);
                })
                .catch((error) => {
                    console.error(error.message);
                });
        } else {
            setSearchResults([]);
        }
    };

    const handleSkip = () => {
        if (newTeamId) {
            navigate(`/app/teams/${newTeamId}`);
        } else {
            setOpen(false);
            setStep(1);
        }
    }

    return (
        <div className="create-team-wrapper">
            <button className='btn bg-pink border-none text-pureWhite' onClick={handleToggle}><i className="fa-solid fa-users"></i>Create New Team</button>
            <div id="create-team-modal" className={modalClass}>
                <div className="modal-box bg-white">
                    {step === 1 && (
                        <div className="flex flex-col gap-2">
                            <div>
                                <label className="label">
                                    <span className="label-text">Team Name</span>
                                </label>
                                <input type="text" onChange={(e) => updateTeamData('name')(e.target.value)} className="input input-bordered w-full text-black bg-white" />
                                <span className="err-message text-red">{formErrorMsg.name}</span>
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">Team Description</span>
                                </label>
                                <textarea className="textarea textarea-bordered w-full text-black bg-white" onChange={(e) => updateTeamData('description')(e.target.value)} />
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="flex flex-col gap-2">
                            <div>
                                <label className="label">
                                    <span className="label-text">Members</span>
                                </label>
                                <div className="scrollable-list-container flex flex-col gap-2">
                                    <input type="text" ref={inputRef} onChange={(e) => {
                                        handleSearchUsers(e.target.value);
                                    }}
                                        className="input input-bordered w-full text-black bg-white"
                                    />
                                    {/* Display search results */}
                                    {searchResults.length > 0 && (
                                        <ul className="scrollable-list max-h-24	overflow-y-auto">
                                            {searchResults.map((user) => (
                                                <li key={user.id} onClick={() => handleAddMember(user.id)} className='cursor-pointer flex flex-row gap-2 items-center hover:bg-pureWhite pt-1 pb-1 pl-2 pr-2'>
                                                    <img src={user.photoURL} className='h-8 w-8 rounded-full' />
                                                    <div className='flex flex-col items-start'>
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
                    )}
                    <div className="modal-action flex-row">
                        {step === 1 && <button className="btn btn-outline border-pink text-pink" onClick={handleToggle}>Cancel</button>}
                        {step === 1 && <button type="button" onClick={handleNextStep} className="btn bg-pink border-none text-pureWhite">Next</button>}
                        {step === 2 && <button className="btn btn-outline border-pink text-pink" onClick={handleSkip}>Skip</button>}
                        {step === 2 && <button type="button" onClick={handleSaveTeam} className="btn bg-pink border-none text-pureWhite">Save</button>}
                    </div>
                </div>
            </div>
        </div>
    );
}
