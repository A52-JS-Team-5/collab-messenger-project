import { get, ref, query, equalTo, orderByChild, update, push } from 'firebase/database';
import { db } from '../config/firebase-config';
import { ZERO } from '../common/constants';

export const getTeamByName = (name) => {
    return get(query(ref(db, 'teams'), orderByChild('name'), equalTo(name)))
        .catch((e) => console.log('Error in getting team', e.message));
};

export const getTeamById = (id) => {
    return get(query(ref(db, 'teams'), orderByChild('id'), equalTo(id)))
        .catch((e) => console.log('Error in getting team data', e.message));
};

export const createTeam = (name, description, owner, members, channels) => {
    const teamsRef = ref(db, `teams`);

    const newTeam = {
        name: name,
        owner: owner,
        description: description,
        members: members,
        channels: channels,
        photoURL: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg',
        createdOn: Date.now(),
    };

    return push(teamsRef, newTeam)
        .then((newTeamRef) => {
            const teamId = newTeamRef.key;
            return teamId;
        })
        .catch((error) => {
            console.log(`Error creating team: ${error.message}`);
        });
};

export const editTeam = (teamName, updates) => {
    return update(ref(db, `teams/${teamName}`), updates)
        .then(() => {
            return 'Successful update';
        })
        .catch(e => console.log(e.message))
}

export const getAllTeamsCount = () => {
    return get(ref(db, `teams`))
        .then(snapshot => {
            if (snapshot.exists()) {
                const allTeams = snapshot.val();
                return Object.keys(allTeams).length;
            } else {
                return ZERO;
            }
        })
        .catch(e => console.log(e.message));
}

export const getTeamsByUser = (handle) => {
    return get(ref(db, `users/${handle}`))
        .then((snapshot) => {
            if (!snapshot.val()) {
                throw new Error(`User with handle @${handle} does not exist!`);
            }

            const user = snapshot.val();
            if (!user.teamsMember) return [];

            return Promise.all(
                Object.keys(user.teamsMember).map((key) => {
                    return get(ref(db, `teams/${key}`)).then((snapshot) => {
                        const team = snapshot.val();

                        if (team === null) {
                            return 'Team is Deleted';
                        }

                        return {
                            name: team.name,
                            createdOn: team.createdOn,
                            id: key,
                            owner: team.owner,
                            members: team.members ? Object.keys(team.members) : [],
                            channels: team.channels ? Object.keys(team.channels) : [],
                            photoURL: team.photoURL,
                        };
                    });
                })
            );
        })
        .catch((e) => console.log('Error in getting teams', e.message));
};
/*
export const getTeamsByMember = (handle) => {
    const teamsRef = ref(db, 'teams');

    return get(teamsRef)
        .then((snapshot) => {
            const teams = [];
            snapshot.forEach((teamSnapshot) => {
                const team = teamSnapshot.val();
                if (team.members && team.members[handle] !== undefined) {
                    teams.push({
                        id: teamSnapshot.key,
                        name: team.name,
                        createdOn: team.createdOn,
                        owner: team.owner,
                        members: team.members ? Object.keys(team.members) : [],
                        channels: team.channels ? Object.keys(team.channels) : [],
                        photoURL: team.photoURL,
                    });
                }
            });
        })
        .catch((error) => {
            console.error('Error getting teams:', error.message);
            throw new Error(error);
        });
};
*/
export const addTeam = (handle, teamId) => {
    const updateTeam = {};
    updateTeam[`/users/${handle}/teamsOwner/${teamId}`] = true;
    updateTeam[`/users/${handle}/teamsMember/${teamId}`] = true;
    updateTeam[`/teams/${teamId}/members/${handle}`] = true;

    return update(ref(db), updateTeam)
        .catch((e) => console.log('Error adding details', e.message));
};

export const updateTeamMembers = (teamId, members) => {
    const updateTeam = {};

    members.forEach((member) => {
        updateTeam[`/teams/${teamId}/members/${member}`] = true;
        updateTeam[`/users/${member}/teamsMember/${teamId}`] = true;
    });

    return update(ref(db), updateTeam)
        .catch((e) => console.log('Error adding details', e.message));
}