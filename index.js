const express = require('express');
const http = require('http');
const router = require('./router');
const { addUser, removeUser, getUser, getUsersInRoom, users } = require('./users');

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);


const socketio = require('socket.io');
const io = socketio(server);

io.origins('*:*');

io.on('connection', function (socket) {
    const id = socket.id;
    let user_room = '';

    /**
     * User Join Function
     */
    socket.on('join', function ({ name, room }) {
        addUser({id, name, room}); // add user to users array
        user_room = room;
        socket.join(user_room);
        socket.emit('user_joined', { users, id, type : 'current_user'});
        socket.broadcast.to(user_room).emit('user_joined', { users, id, type: 'new_user'}); // emit event with modified users array
    })

    /**
     * User Disconnect function
     */
    socket.on('disconnect', () => {
        socket.leave(socket);
        removeUser(id); // remove user form users array
        socket.emit('user_left', {users, id, type: 'current_user'});
        socket.broadcast.to(user_room).emit('user_left', {users, id, type: 'new_user'});  // emit event with modified users
    })


})


app.use(router);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))