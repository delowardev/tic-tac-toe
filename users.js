const users = [];

/**
 * Create User
 */
const addUser = ({id, name, room}) => {
    const existing = users.find(user => user.name === name && user.room === room);
    if(existing){
        return {error: 'Username is taken'}
    }

    const user = {
        id,
        name,
        room,
        joined_at: Date.now()
    };

    users.push(user);
    return { user };

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
  * Getting user
  */

const getUser = id => users.find(user => user.id === id);

  /**
   * Get user in room
   */

const getUsersInRoom = room => users.filter(user => user.room === room);


module.exports = {addUser, removeUser, getUser, getUsersInRoom, users}