import { get, ref, query, equalTo, orderByChild, update, push, remove } from 'firebase/database';
import { db } from '../config/firebase-config';
import { DEFAULT_TEAM_PHOTO, ZERO } from '../common/constants';

export const getTeamByName = (name) => {
    return get(query(ref(db, 'teams'), orderByChild('name'), equalTo(name)))
        .catch((e) => console.log('Error in getting team', e.message));
};

export const getTeamById = (id) => {

    return get(ref(db, `teams/${id}`))
        .then(result => {
            if (!result.exists()) {
                throw new Error(`Team with id ${id} does not exist!`);
            }

            const team = result.val();

            return {
                name: team.name,
                createdOn: team.createdOn,
                description: team.description,
                id: id,
                owner: team.owner,
                members: team.members ? Object.keys(team.members) : [],
                channels: team.channels ? Object.keys(team.channels) : [],
                photoURL: team.photoURL,
            }
        })
        .catch(e => console.log(e.message))
};

export const createTeam = (name, description, owner, members, channels) => {
    const teamsRef = ref(db, `teams`);

    const newTeam = {
        name: name,
        owner: owner,
        description: description,
        members: members,
        channels: channels,
        photoURL: DEFAULT_TEAM_PHOTO,
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

export const removeTeamMember = (teamId, member) => {
    const updates = {};
    updates[`/teams/${teamId}/members/${member}`] = null;
    updates[`/users/${member}/teamsMember/${teamId}`] = null;

    return update(ref(db), updates)
        .catch((e) => console.log('Error updating details', e.message));
}

export const deleteTeam = (teamId) => {
    return remove(ref(db, `teams/${teamId}`))
        .catch((e) => console.log('Error in deleting team', e.message));
}

export const removeTeamFromUser = (teamId, member) => {
    const updates = {};
    updates[`/users/${member}/teamsMember/${teamId}`] = null;

    return update(ref(db), updates)
        .catch((e) => console.log('Error updating details', e.message));
}

export const getTeamsByUser = (handle) => {
    return get(ref(db, `users/${handle}/teamsMember`))
        .then((snapshot) => {
            if (!snapshot.exists()) {
                return [];
            }

            const teamsMember = snapshot.val();

            return Promise.all(
                Object.keys(teamsMember).map((key) => {
                    return get(ref(db, `teams/${key}`)).then((snapshot) => {
                        const team = snapshot.val();

                        if (team !== null) {
                            return {
                                id: snapshot.key,
                                name: team.name,
                                createdOn: team.createdOn,
                                owner: team.owner,
                                members: team.members ? Object.keys(team.members) : [],
                                channels: team.channels ? Object.keys(team.channels) : [],
                                photoURL: team.photoURL,
                                description: team.description,
                            };
                        }
                    });
                })
            );
        })
        .catch((e) => console.log('Error in getting teams', e.message));
};