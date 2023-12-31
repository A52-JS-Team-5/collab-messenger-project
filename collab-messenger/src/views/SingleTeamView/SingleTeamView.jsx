import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppContext from "../../context/AuthContext";
import { onValue, ref } from "firebase/database";
import { db } from "../../config/firebase-config";
import TeamDetails from "../../components/TeamDetails/TeamDetails";
import LeaveTeamModal from "../../components/LeaveTeamModal/LeaveTeamModal";
import DeleteTeamModal from "../../components/DeleteTeamModal/DeleteTeamModal";
import ChannelBox from "../../components/ChannelBox/ChannelBox";
import AddChannelModal from "../../components/AddChannelModal/AddChannelModal";
import { useMediaQuery } from 'react-responsive';
import EnterChannel from "../../components/EnterChannel/EnterChannel";
import ChannelDetails from "../../components/ChannelDetails/ChannelDetails";
import ChannelInformation from "../../components/ChannelInformation/ChannelInformation";
import PageNotFound from "../PageNotFound/PageNotFound";

const SingleTeamView = () => {

    const { teamId } = useParams();
    const [teamDetails, setTeamDetails] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const user = useContext(AppContext);
    const navigate = useNavigate();
    const [showManageTeam, setShowManageTeam] = useState(false);
    const [activeComponent, setActiveComponent] = useState(0); // 0 for Default, 1 for TeamDetails, 2 for ChannelView
    const [allTeamChannelsOfUser, setAllTeamChannelsOfUser] = useState([]);
    const [isChannelInfoVisible, setIsChannelInfoVisible] = useState(false);
    const channelLayout = isChannelInfoVisible === true ? 'basis-3/5' : 'basis-4/5';
    const [noData, setNoData] = useState(false);
    const [loggedUserChannels, setLoggedUserChannels] = useState([]);

    useEffect(() => {
        if (user?.userData?.handle) {
            const userChannelsRef = ref(db, `users/${user.userData.handle}/channels`);

            const userChannelsListener = onValue(userChannelsRef, (snapshot) => {
                const data = snapshot.val();

                if (data === null) {
                    setLoggedUserChannels([])
                } else {
                    setLoggedUserChannels(Object.keys(data))
                }

            })

            return () => {
                userChannelsListener();
            };
        }
    }, [user?.userData?.handle])

    useEffect(() => {
        const teamRef = ref(db, `teams/${teamId}`);

        const teamListener = onValue(teamRef, (snapshot) => {
            const updatedTeamData = snapshot.val();

            if (updatedTeamData === null) {
                setIsLoading(false);
                setNoData(true);
                return;
            }

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

            // Check if the current user is the owner
            if (teamDetails.owner === user?.userData?.handle) {
                setShowManageTeam(true);
            }

            setIsLoading(false);
        });

        return () => {
            teamListener();
        };
    }, [teamId, user.userData?.handle, user.userData?.channels]);

    useEffect(() => {
        if (teamDetails?.channels) {
            const userChannels = teamDetails.channels.filter((channel) =>
                loggedUserChannels.includes(channel)
            );
            setAllTeamChannelsOfUser(userChannels);
        }
    }, [teamDetails?.channels, loggedUserChannels]);

    const handleClick = () => {
        const elem = document.activeElement;
        if (elem) {
            elem?.blur();
        }
    };

    // State and functions that set the active component
    const { channelId } = useParams();
    useEffect(() => {
        if (channelId) {
            setActiveMobileComponent(2);
            setActiveComponent(2);
        } else {
            setActiveMobileComponent(0);
        }
    }, [channelId]);

    const handleClickTeamDetails = () => {
        setIsChannelInfoVisible(false);
        setActiveComponent(1);
        handleClick();
        navigate(`/app/teams/${teamId}`);
    };

    const handleClickChannelBox = () => {
        setActiveComponent(2);
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

    // State and functions for CreateChannelModal
    const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);

    const openCreateChannelModal = () => {
        setIsCreateChannelModalOpen(true);
    }

    const closeCreateChannelModal = () => {
        setIsCreateChannelModalOpen(false);
    }

    // Responsiveness
    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-width: 1224px)'
    })
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' })

    // Mobile functions and states
    const [activeMobileComponent, setActiveMobileComponent] = useState(0); // 0 for Default View, 1 for TeamDetails, 2 for Channel

    const handleMobileClickTeamDetails = () => {
        setActiveMobileComponent(1);
        handleClick();
        navigate(`/app/teams/${teamId}`);
    };

    const handleMobileClickChannelBox = () => {
        setActiveMobileComponent(2);
    };

    const handleMobileDefaultClick = () => {
        setActiveMobileComponent(0);
        navigate(`/app/teams/${teamId}`);
    }

    const handleReturnToChannel = () => {
        setActiveMobileComponent(2);
        setIsMobileChannelInfoVisible(false);
    }

    const [isMobileChannelInfoVisible, setIsMobileChannelInfoVisible] = useState(false);

    return (
        <>
            {isDesktopOrLaptop && !noData && <div className='flex flex-row gap-4 h-[86vh]'>
                {!isLoading && (
                    <div className='flex flex-row mt-4 gap-4 h-full w-full'>
                        <div className='flex flex-col basis-1/5 p-4 rounded-md bg-pureWhite dark:bg-darkFront dark:text-darkText'>
                            <div className='flex flex-col gap-2'>
                                <div className='flex flex-row items-center'>
                                    <i className="fa-solid fa-chevron-left fa-xs"></i>
                                    <div className='btn btn-link pl-1 pr-1 pt-0 pb-0 mt-0 mb-0' onClick={() => navigate('/app/teams')}>
                                        All Teams
                                    </div>
                                </div>
                                <div className='flex flex-col gap-4'>
                                    <img src={teamDetails?.photoURL} className='w-24 h-24 object-cover rounded-md'></img>
                                    <div className='flex flex-row items-center justify-between'>
                                        <h2 className='text-xl text-left font-bold truncate	w-48'>{teamDetails?.name}</h2>
                                        <div className="dropdown dropdown-end">
                                            <label tabIndex="0" className="btn btn-ghost btn-square btn-sm text-blue hover:bg-blue30 focus:!bg-blue30 dark:text-yellow dark:hover:bg-[#35331C] dark:focus:!bg-[#35331C]">
                                                <i className="fa-solid fa-ellipsis-vertical"></i>
                                            </label>
                                            <ul tabIndex="0" className="dropdown-content z-[1] menu p-2 shadow-md bg-pureWhite rounded-box w-52 dark:bg-darkAccent">
                                                <li onClick={handleClickTeamDetails}><a className="dark:!text-yellow">Team Details</a></li>
                                                {showManageTeam && <li onClick={openCreateChannelModal}><a className="dark:!text-yellow">Add Channel</a></li>}
                                                {/*Leave - only for members who are not the owner*/}
                                                {!showManageTeam && <li onClick={openLeaveModal}><a className="dark:!text-yellow">Leave Team</a></li>}
                                                {/*Delete - only for team owner*/}
                                                {showManageTeam && <li onClick={openDeleteTeamModal}><a className="dark:!text-yellow">Delete Team</a></li>}
                                            </ul>
                                            {isLeaveModalOpen && (<LeaveTeamModal teamId={teamId} isOpen={isLeaveModalOpen} onClose={closeLeaveModal} />)}
                                            {isDeleteTeamModalOpen && (<DeleteTeamModal teamData={teamDetails} teamId={teamId} isOpen={isDeleteTeamModalOpen} onClose={closeDeleteTeamModal} />)}
                                            {isCreateChannelModalOpen && (<AddChannelModal teamId={teamId} teamParticipants={teamDetails.members} teamOwner={teamDetails.owner} isOpen={isCreateChannelModalOpen} onClose={closeCreateChannelModal} teamName={teamDetails.name} />)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="divider"></div>
                            <div className="flex flex-col gap-1 basis-128 overflow-y-auto [&::-webkit-scrollbar]:[width:8px]
                [&::-webkit-scrollbar-thumb]:bg-lightBlue [&::-webkit-scrollbar-thumb]:rounded-md p-1 dark:[&::-webkit-scrollbar-thumb]:bg-mint">
                                {allTeamChannelsOfUser.map(channel => (
                                    <ChannelBox key={channel} channelId={channel} onClick={handleClickChannelBox} />)
                                )}
                            </div>
                        </div>
                        {activeComponent === 0 && <div className="basis-4/5 w-full flex items-center overflow-auto p-4">
                            <EnterChannel />
                        </div>}
                        {activeComponent === 2 && <div className={`${channelLayout} w-full flex items-center overflow-auto p-4 rounded-md bg-pureWhite dark:bg-darkFront`}>
                            <ChannelDetails isChannelInfoVisible={isChannelInfoVisible} setIsChannelInfoVisible={setIsChannelInfoVisible} />
                        </div>}
                        {activeComponent === 1 && <TeamDetails teamDetails={teamDetails} showManageTeam={showManageTeam} />}
                        {isChannelInfoVisible === true && (
                            <div id='chatInformation-section-layout' className={`basis-1/5 bg-pureWhite w-full rounded-md dark:bg-darkFront dark:text-darkText`}>
                                <ChannelInformation />
                            </div>
                        )}
                    </div>
                )}
            </div >}
            {/*Mobile and Tablet Views and Logic*/}
            {isTabletOrMobile && !noData && <div className='flex flex-row mt-4 gap-4 h-[81vh] w-full'>
                {!isLoading && activeMobileComponent === 0 && (
                    <div className='flex flex-row gap-4 h-full w-full'>
                        <div className='flex flex-col p-4 rounded-md bg-pureWhite w-full dark:bg-darkFront dark:text-darkText'>
                            <div className='flex flex-col gap-2'>
                                <div className='flex flex-row items-center'>
                                    <i className="fa-solid fa-chevron-left fa-xs"></i>
                                    <div className='btn btn-link pl-1 pr-1 pt-0 pb-0 mt-0 mb-0' onClick={() => navigate('/app/teams')}>
                                        All Teams
                                    </div>
                                </div>
                                <div className='flex flex-col gap-4'>
                                    <img src={teamDetails?.photoURL} className='w-24 h-24 object-cover rounded-md'></img>
                                    <div className='flex flex-row items-center justify-between'>
                                        <h2 className='text-xl text-left font-bold truncate	w-48'>{teamDetails?.name}</h2>
                                        <div className="dropdown dropdown-end">
                                            <label tabIndex="0" className="btn btn-ghost btn-square btn-sm text-blue hover:bg-blue30 focus:!bg-blue30 dark:text-yellow dark:hover:bg-[#35331C] dark:focus:!bg-[#35331C]">
                                                <i className="fa-solid fa-ellipsis-vertical"></i>
                                            </label>
                                            <ul tabIndex="0" className="dropdown-content z-[1] menu p-2 shadow-md bg-pureWhite rounded-box w-52 dark:bg-darkAccent">
                                                <li onClick={handleMobileClickTeamDetails}><a className="dark:!text-yellow">Team Details</a></li>
                                                {showManageTeam && <li onClick={openCreateChannelModal}><a className="dark:!text-yellow">Add Channel</a></li>}
                                                {/*Leave - only for members who are not the owner*/}
                                                {!showManageTeam && <li onClick={openLeaveModal}><a className="dark:!text-yellow">Leave Team</a></li>}
                                                {/*Delete - only for team owner*/}
                                                {showManageTeam && <li onClick={openDeleteTeamModal}><a className="dark:!text-yellow">Delete Team</a></li>}
                                            </ul>
                                            {isLeaveModalOpen && (<LeaveTeamModal teamId={teamId} isOpen={isLeaveModalOpen} onClose={closeLeaveModal} />)}
                                            {isDeleteTeamModalOpen && (<DeleteTeamModal teamData={teamDetails} teamId={teamId} isOpen={isDeleteTeamModalOpen} onClose={closeDeleteTeamModal} />)}
                                            {isCreateChannelModalOpen && (<AddChannelModal teamId={teamId} teamParticipants={teamDetails.members} teamOwner={teamDetails.owner} isOpen={isCreateChannelModalOpen} onClose={closeCreateChannelModal} teamName={teamDetails.name} />)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="divider"></div>
                            <div className="flex flex-col gap-1 h-[32vh] overflow-y-auto [&::-webkit-scrollbar]:[width:8px]
                [&::-webkit-scrollbar-thumb]:bg-lightBlue [&::-webkit-scrollbar-thumb]:rounded-md p-1">
                                {allTeamChannelsOfUser.map(channel => (
                                    <ChannelBox key={channel} channelId={channel} onClick={handleMobileClickChannelBox} />)
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {!isLoading && activeMobileComponent === 2 && !isMobileChannelInfoVisible && <div className="!basis-full max-xl:basis-4/5 w-full flex flex-col items-start overflow-auto p-4 rounded-md bg-pureWhite dark:bg-darkFront dark:text-darkText">
                    <div className='flex flex-row items-center xl:hidden'>
                        <i className="fa-solid fa-chevron-left fa-xs"></i>
                        <div className='flex flex-col w-full items-start btn btn-link pl-1 pr-1 pt-0 pb-0 mt-0 mb-0' onClick={handleMobileDefaultClick}>Return To Team</div>
                    </div>
                    <ChannelDetails isChannelInfoVisible={isMobileChannelInfoVisible} setIsChannelInfoVisible={setIsMobileChannelInfoVisible} />
                </div>}
                {isMobileChannelInfoVisible === true && (
                    <div id='chatInformation-section-layout' className={`bg-pureWhite w-full rounded-md dark:bg-darkFront dark:text-darkText`}>
                        <div className='flex flex-start'>
                            <button className='btn btn-ghost' onClick={handleReturnToChannel}><i className="fa-solid fa-arrow-left"></i></button>
                        </div>
                        <ChannelInformation />
                    </div>
                )}
                {!isLoading && activeMobileComponent === 1 && <TeamDetails teamDetails={teamDetails} showManageTeam={showManageTeam} onClick={handleMobileDefaultClick} />}
            </div >}
            {noData && <PageNotFound />}
        </>
    )
}

export default SingleTeamView;