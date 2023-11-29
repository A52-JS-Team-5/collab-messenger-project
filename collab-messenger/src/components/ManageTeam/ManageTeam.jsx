import { useState, useEffect } from "react";
import ChangeTeamPhoto from "../ChangeTeamPhoto/ChangeTeamPhoto";
import PropTypes from 'prop-types';
import { editTeam } from "../../services/teams.services";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageTeam = ({ teamDetails }) => {
    const [error, setError] = useState(false);
    const [isTeamNameUpdated, setIsTeamNameUpdated] = useState(false);
    const [isTeamDescriptionUpdated, setIsTeamDescriptionUpdated] = useState(false);
    const [teamName, setTeamName] = useState({});
    const [teamDescription, setTeamDescription] = useState({});

    const updateTeamName = (e) => {
        setTeamName({
            name: e.target.value,
        });
        setIsTeamNameUpdated(true);
    }

    const updateTeamDescription = (e) => {
        setTeamDescription({
            description: e.target.value,
        });
        setIsTeamDescriptionUpdated(true);
    }

    useEffect(() => {
        if (teamDetails) {
            setTeamName(teamDetails.name);
            setTeamDescription(teamDetails.description);
        }
    }, [teamDetails])

    const onTeamNameEdit = (event) => {
        event.preventDefault();

        if (!teamName) {
            setError('Name is required');
            return;
        }

        editTeam(teamDetails.id, teamName)
            .then((result) => {
                if (result === 'Successful update') {
                    toast('Team name updated successfully.');
                }
            })
            .catch((error) => {
                toast(`Error updating team name. Please try again later.`);
                console.log(error);
            });
    }

    const onTeamDescriptionEdit = (event) => {
        event.preventDefault();

        editTeam(teamDetails.id, teamDescription)
            .then((result) => {
                if (result === 'Successful update') {
                    toast('Team description updated successfully.');
                }
            })
            .catch((error) => {
                toast(`Error updating team description. Please try again later.`);
                console.log(error);
            });
    }

    return (
        <div className="flex flex-col gap-10 items-start p-4 rounded-md bg-white">
            <div className="flex flex-col items-start w-full gap-2">
                <div className="flex flex-col items-start">
                    <h2 className='font-bold text-lg'>Team Details</h2>
                    <p className="text-left">Basic information related to your team.</p>
                </div>
                <div className="flex flex-col gap-4 items-start w-full">
                    <div className="flex flex-row gap-4 items-center w-full">
                        <div className="form-control w-full">
                            <input type='text' className="input input-bordered w-full bg-white" defaultValue={teamDetails.name} onChange={updateTeamName} />
                            {error && <span className="err-message text-red">{error}</span>}
                        </div>
                        {isTeamNameUpdated && <button onClick={onTeamNameEdit} className="btn btn-square bg-pink text-pureWhite border-none"><i className="fa-regular fa-floppy-disk"></i></button>}
                    </div>
                    <div className="flex flex-row gap-4 items-end w-full">
                        <div className="form-control w-full">
                            <textarea className="textarea textarea-bordered h-24 textarea-md w-full bg-white" placeholder="Description" defaultValue={teamDetails.description} onChange={updateTeamDescription}></textarea>
                        </div>
                        {isTeamDescriptionUpdated && <button onClick={onTeamDescriptionEdit} className="btn btn-square bg-pink text-pureWhite border-none"><i className="fa-regular fa-floppy-disk"></i></button>}
                    </div>
                </div>
            </div>
            <ChangeTeamPhoto teamDetails={teamDetails} />
        </div >
    )
}

export default ManageTeam;

ManageTeam.propTypes = {
    teamDetails: PropTypes.object,
};
