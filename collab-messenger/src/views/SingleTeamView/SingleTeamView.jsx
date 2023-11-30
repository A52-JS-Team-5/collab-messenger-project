import { useContext, useEffect, useState } from "react";
import { getTeamById } from "../../services/teams.services";
import { useNavigate, useParams } from "react-router-dom";
import AppContext from "../../context/AuthContext";
import { onValue, ref } from "firebase/database";
import { db } from "../../config/firebase-config";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import TeamDetails from "../../components/TeamDetails/TeamDetails";
import LeaveTeamModal from "../../components/LeaveTeamModal/LeaveTeamModal";
import DeleteTeamModal from "../../components/DeleteTeamModal/DeleteTeamModal";
import PageNotFound from "../PageNotFound/PageNotFound";
import ChannelBox from "../../components/ChannelBox/ChannelBox";
import { Outlet } from "react-router-dom";

const SingleTeamView = () => {

    const { teamId } = useParams();
    const [teamDetails, setTeamDetails] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const user = useContext(AppContext);
    const navigate = useNavigate();
    const [showManageTeam, setShowManageTeam] = useState('');
    const [activeComponent, setActiveComponent] = useState(0); // 0 for ChannelView, 1 for TeamDetails
    const [isDeleted, setIsDeleted] = useState(false);
    const [allTeamChannelsOfUser, setAllTeamChannelsOfUser] = useState([]);

    useEffect(() => {
        const teamRef = ref(db, `teams/${teamId}`);

        getTeamById(teamId)
            .then((teamData) => {
                if (teamData) {
                    setTeamDetails(teamData);
                    setIsLoading(false);

                    // add logic for filtering channels that the user is in with team channels
                    const userChannels = teamData.channels.filter((channel) => Object.keys(user.userData?.channels).includes(channel));
                    setAllTeamChannelsOfUser(userChannels);

                    // Check if the current user is the owner
                    if (teamData.owner === user.userData?.handle) {
                        setShowManageTeam(true);
                    }
                } else {
                    setIsDeleted(true);
                }
            })
            .catch((error) => {
                setIsLoading(false);
                console.log('Error fetching post', error.message);
                toast('An error occurred while trying to get the team details.')
            });

        // Listen for changes in team details
        const teamListener = onValue(teamRef, (snapshot) => {
            const updatedTeamData = snapshot.val();

            if (updatedTeamData) {
                const teamDetails = {
                    name: updatedTeamData.name,
                    createdOn: updatedTeamData.createdOn,
                    description: updatedTeamData.description,
                    id: teamId,
                    owner: updatedTeamData.owner,
                    members: updatedTeamData.members ? Object.keys(updatedTeamData.members) : [],
                    channels: updatedTeamData.channels ? Object.keys(updatedTeamData.channels) : [],
                    photoURL: updatedTeamData.photoURL,
                };
                setTeamDetails(teamDetails);
            }
        });

        return () => {
            teamListener();
        };
    }, [teamId, user.userData?.handle, user.userData?.channels]);

    const handleClick = () => {
        const elem = document.activeElement;
        if (elem) {
            elem?.blur();
        }
    };

    const handleListClick = (tabIndex) => {
        setActiveComponent(tabIndex);
        handleClick();
    };

    // State and functions for LeaveTeamModal
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

    const openLeaveModal = () => {
        setIsLeaveModalOpen(true);
    };

    const closeLeaveModal = () => {
        setIsLeaveModalOpen(false);
    };

    // State and functions for DeleteTeamModal
    const [isDeleteTeamModalOpen, setIsDeleteTeamModalOpen] = useState(false);

    const openDeleteTeamModal = () => {
        setIsDeleteTeamModalOpen(true);
    };

    const closeDeleteTeamModal = () => {
        setIsDeleteTeamModalOpen(false);
    };

    return (
        <div className='flex flex-row mt-4 gap-4 h-[90vh]'>
            {!isLoading && !isDeleted && (
                <div className='flex flex-row mt-4 gap-4 h-full'>
                    <div className='flex flex-col basis-1/5 p-4 rounded-md bg-pureWhite'>
                        <div className='flex flex-col gap-2'>
                            <div className='flex flex-row items-center'>
                                <i className="fa-solid fa-chevron-left fa-xs"></i>
                                <div className='btn btn-link pl-1 pr-1 pt-0 pb-0 mt-0 mb-0' onClick={() => navigate(-1)}>
                                    All Teams
                                </div>
                            </div>
                            <div className='flex flex-col gap-4'>
                                <img src={teamDetails?.photoURL} className='w-24 h-24 object-cover rounded-md'></img>
                                <div className='flex flex-row items-center justify-between'>
                                    <h2 className='text-xl text-left font-bold'>{teamDetails?.name}</h2>
                                    <div className="dropdown dropdown-end">
                                        <label tabIndex="0" className="btn btn-ghost btn-square btn-sm text-blue hover:bg-blue30 focus:!bg-blue30">
                                            <i className="fa-solid fa-ellipsis-vertical"></i>
                                        </label>
                                        <ul tabIndex="0" className="dropdown-content z-[1] menu p-2 shadow-md bg-pureWhite rounded-box w-52">
                                            <li onClick={() => handleListClick(1)}><a>Team Details</a></li>
                                            <li onClick={handleClick}><a>Add Channel</a></li>
                                            {/*Leave - only for members who are not the owner*/}
                                            {!showManageTeam && <li onClick={openLeaveModal}><a>Leave Team</a></li>}
                                            {/*Delete - only for team owner*/}
                                            {showManageTeam && <li onClick={openDeleteTeamModal}><a>Delete Team</a></li>}
                                        </ul>
                                        {isLeaveModalOpen && (<LeaveTeamModal teamId={teamId} isOpen={isLeaveModalOpen} onClose={closeLeaveModal} />)}
                                        {isDeleteTeamModalOpen && (<DeleteTeamModal teamData={teamDetails} teamId={teamId} isOpen={isDeleteTeamModalOpen} onClose={closeDeleteTeamModal} />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="divider"></div>
                        <div className="flex flex-col gap-1">
                            {allTeamChannelsOfUser.map(channel => (
                            <ChannelBox key={channel} channelId={channel}/>)
                            )}
                        </div>
                    </div>
                    <div className="basis-11/12 w-full h-[92vh] flex items-center place-content-evenly overflow-auto">
                        <Outlet />
                    </div>
                    {activeComponent === 1 && <TeamDetails teamDetails={teamDetails} showManageTeam={showManageTeam} />}
                </div>
            )}
            {isDeleted && <PageNotFound />}
        </div >
    )
}

export default SingleTeamView;