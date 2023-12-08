import { useContext, useEffect, useState } from "react";
import CreateTeam from "../../components/CreateTeam/CreateTeam";
import AppContext from "../../context/AuthContext";
import EmptyList from "../../components/EmptyList/EmptyList";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { get, onValue, ref } from "firebase/database";
import { db } from "../../config/firebase-config";

const Teams = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { userData } = useContext(AppContext);
    const [teams, setTeams] = useState([]);
    const navigate = useNavigate();
    const [teamsMember, setTeamsMember] = useState([]);

    useEffect(() => {
        if (userData?.handle) {

            const userRef = ref(db, `users/${userData.handle}/teamsMember`);
            const teamsMemberListener = onValue(userRef, (snapshot) => {
                if (!snapshot.exists()) {
                    setTeams([]);
                    setIsLoading(false);
                    return;
                }

                const teamsMember = snapshot.val();
                setTeamsMember(teamsMember);

                const promises = Object.keys(teamsMember).map((key) => {
                    const teamRef = ref(db, `teams/${key}`);
                    return get(teamRef)
                        .then((teamSnapshot) => {

                            if (!teamSnapshot.exists()) {
                                return (`Team does not exist!`);
                            }

                            const team = teamSnapshot.val();

                            return {
                                id: key,
                                name: team.name,
                                createdOn: team.createdOn,
                                owner: team.owner,
                                members: team.members ? Object.keys(team.members) : [],
                                channels: team.channels ? Object.keys(team.channels) : [],
                                photoURL: team.photoURL,
                                description: team.description,
                            };
                        })
                        .catch(e => console.log(e.message))
                });

                // Wait for all promises to resolve
                Promise.all(promises)
                    .then((teamDetails) => {
                        setTeams(teamDetails.filter(team => team !== 'Team does not exist!'));
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        console.error('Error fetching team details:', error);
                        setIsLoading(false);
                        toast('An error occurred while trying to get the teams details.');
                    });
            });

            return () => {
                teamsMemberListener();

            };
        }
    }, [userData?.handle]);

    useEffect(() => {
        if (teamsMember) {
            const teamsToMonitor = Object.keys(teamsMember);
            const teamsChangedListeners = [];

            // Attach onValue listener to each specific team
            teamsToMonitor.map((teamId) => {
                const teamRef = ref(db, `teams/${teamId}`);
                const teamChangedListener = onValue(teamRef, (snapshot) => {
                    if (snapshot.exists()) {
                        setTeams((prevTeams) =>
                            prevTeams.map((prevTeam) =>
                                prevTeam.id === teamId ? { ...prevTeam, ...snapshot.val() } : prevTeam
                            )
                        );
                    }
                });

                teamsChangedListeners.push(teamChangedListener);
            });

            return () => {
                teamsChangedListeners.map((listener) => listener());
            };
        }
    }, [teamsMember]);

    return (
        <div className='mt-4'>
            <div className='p-4 flex flex-row justify-between items-center bg-pureWhite rounded-lg dark:bg-darkFront dark:text-darkText'>
                <h2 className='font-bold text-left'>Your Teams</h2>
                <CreateTeam />
            </div>
            <div className='mt-4 flex flex-row justify-between h-[70.3vh] md:h-[79vh] items-start overflow-y-auto [&::-webkit-scrollbar]:[width:8px]
                [&::-webkit-scrollbar-thumb]:bg-lightBlue [&::-webkit-scrollbar-thumb]:rounded-md p-1 dark:[&::-webkit-scrollbar-thumb]:bg-mint'>
                {!isLoading && teams.length > 0 && (
                    <div className='grid grid-cols-5 max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3 max-xl:grid-cols-4 gap-4 w-full'>
                        {teams.map(team => {
                            return (
                                <div className='flex flex-col gap-4 p-6 rounded-md bg-pureWhite max-h-44 justify-center items-center cursor-pointer dark:bg-darkFront dark:text-darkText' onClick={() => navigate(`/app/teams/${team?.id}`)} key={team.id}>
                                    <img src={team?.photoURL} className='w-20 h-20 object-cover rounded-full' />
                                    <div className='font-bold truncate w-48'>{team?.name}</div>
                                </div>
                            )
                        })}
                    </div>
                )}
                {!isLoading && teams.length === 0 &&
                    <div className='flex w-full h-full'><EmptyList /></div>}
            </div>
        </div>
    )
}

export default Teams;
