const users = [];

/**
 * Create User
 */
const addUser = ({id, name, room, match, playing = false}) => {
    const existing = users.find(user => user.name === name && user.room === room);
    if(existing){
        return {error: 'Username is taken'}
    }

    const user = {
        id,
        name,
        room,
        match,
        playing,
        joined_at: Date.now()
    };

    users.unshift(user);
}

/**
 * Remoe User
 */

const removeUser = id => {
     const index = users.findIndex(user => user.id === id);
     if(index !== -1){
        return users.splice(index, 1)[0]
     }
}

/**
 * Get All users
 */

const getUsers = () => users;

// export modules
module.exports = {addUser, removeUser, getUsers};
