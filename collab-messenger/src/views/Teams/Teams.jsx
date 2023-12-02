import { useContext, useEffect, useState } from "react";
import CreateTeam from "../../components/CreateTeam/CreateTeam";
import AppContext from "../../context/AuthContext";
import EmptyList from "../../components/EmptyList/EmptyList";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { onValue, ref } from "firebase/database";
import { db } from "../../config/firebase-config";

const Teams = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { userData } = useContext(AppContext);
    const [teams, setTeams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (userData?.handle) {
            const userRef = ref(db, `users/${userData.handle}/teamsMember`);

            // Listen for changes in teamsMember
            const teamsMemberListener = onValue(userRef, (snapshot) => {
                if (!snapshot.exists()) {
                    setTeams([]);
                    setIsLoading(false);
                    return;
                }

                const teamsMember = snapshot.val();
                const updatedTeams = [];

                // Create an array of promises for fetching team data
                const promises = Object.keys(teamsMember).map((key) => {
                    const teamRef = ref(db, `teams/${key}`);

                    // Listen for changes in individual teams
                    const teamListener = onValue(teamRef, (teamSnapshot) => {
                        const team = teamSnapshot.val();

                        if (team === null) {
                            // Update existing team data
                            const updatedTeamIndex = updatedTeams.findIndex(t => t.id === key);
                            if (updatedTeamIndex !== -1) {
                                updatedTeams.splice(updatedTeamIndex, 1, { id: key, message: 'Team is Deleted' });
                            }
                        } else {
                            const updatedTeam = {
                                id: key,
                                name: team.name,
                                createdOn: team.createdOn,
                                owner: team.owner,
                                members: team.members ? Object.keys(team.members) : [],
                                channels: team.channels ? Object.keys(team.channels) : [],
                                photoURL: team.photoURL,
                                description: team.description,
                            };

                            // Update or add the team in the list
                            const existingTeamIndex = updatedTeams.findIndex(t => t.id === key);
                            if (existingTeamIndex !== -1) {
                                updatedTeams.splice(existingTeamIndex, 1, updatedTeam);
                            } else {
                                updatedTeams.push(updatedTeam);
                            }
                        }

                        // Update state with the latest teams
                        setTeams(updatedTeams);
                        setIsLoading(false);
                    });

                    return teamListener;
                });

                // Wait for all promises to resolve
                return Promise.all(promises)
                    .catch(() => {
                        setIsLoading(false);
                        toast('An error occurred while trying to get the teams you are part of.')
                    });
            });

            // Return the listener so it can be used to unsubscribe if needed
            return teamsMemberListener;
        }

    }, [userData?.handle]);

    return (
        <div className='mt-4'>
            <div className='p-4 flex flex-row justify-between items-center bg-pureWhite rounded-lg'>
                <h2 className='font-bold'>Your Teams</h2>
                <CreateTeam />
            </div>
            {!isLoading &&
                <div className='mt-4 flex flex-row justify-between h-[79vh] items-start overflow-y-auto [&::-webkit-scrollbar]:[width:8px]
                [&::-webkit-scrollbar-thumb]:bg-lightBlue [&::-webkit-scrollbar-thumb]:rounded-md p-1'>
                    {teams.length > 0 ? (
                        <div className='grid grid-cols-5 max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3 max-xl:grid-cols-4 gap-4 w-full'>
                            {teams.map(team => {
                                return (
                                    <div className='flex flex-col gap-4 p-6 rounded-md bg-pureWhite max-h-44 justify-center items-center cursor-pointer' onClick={() => navigate(`/app/teams/${team?.id}`)} key={team.id}>
                                        <img src={team?.photoURL} className='w-20 h-20 object-cover rounded-full' />
                                        <div className='font-bold'>{team?.name}</div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <EmptyList />
                    )}
                </div>
            }
        </div>
    )
}

export default Teams;
