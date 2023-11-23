import { useContext, useEffect, useState } from "react";
import CreateTeam from "../../components/CreateTeam/CreateTeam";
import AppContext from "../../context/AuthContext";
import { getTeamsByUser } from "../../services/teams.services";
import EmptyList from "../../components/EmptyList/EmptyList";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Teams = () => {
    const [isLoading, setIsLoading] = useState(true);
    const user = useContext(AppContext);
    const [teams, setTeams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.userData?.handle) {
            getTeamsByUser(user.userData.handle)
                .then((allTeams) => {
                    const existingTeams = allTeams.filter((t) => t !== 'Team is Deleted');
                    setTeams(existingTeams);
                    setIsLoading(false);
                })
                .catch(e => {
                    console.log('Error getting teams', e.message);
                    setIsLoading(false);
                    toast('An error occurred while trying to get the teams you are part of.')
                })
        }
    }, [user]);

    return (
        <div className='mt-4'>
            <div className='p-4 flex flex-row justify-between items-center bg-white rounded-lg'>
                <h2 className='font-bold'>Your Teams</h2>
                <CreateTeam />
            </div>
            {!isLoading &&
                <div className='mt-4 w-full flex flex-row justify-between h-[79vh] overflow-y-auto [&::-webkit-scrollbar]:[width:8px]
                [&::-webkit-scrollbar-thumb]:bg-lightBlue [&::-webkit-scrollbar-thumb]:rounded-md p-1'>
                    {teams.length > 0 ? (
                        <div className='grid grid-cols-5 max-sm:grid-cols-1 max-md:grid-cols-2 max-lg:grid-cols-3 max-xl:grid-cols-4 gap-4 w-full'>
                            {teams.map(team => {
                                return (
                                    <div className='flex flex-col gap-4 p-6 rounded-md bg-white items-center cursor-pointer' onClick={() => navigate(`/app/teams/${team?.id}`)} key={team.id}>
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