const express = require('express');
const http = require('http');
const router = require('./router');
// const cors = require('cors');
const { addUser, removeUser, getUser, getUsersInRoom, users } = require('./users');

const PORT = process.env.PORT || 5000;

const app = express();
// app.use(cors());
const server = http.createServer(app);


const socketio = require('socket.io');
const io = socketio(server);

io.origins('*:*');

io.on('connection', function (socket) {
    const id = socket.id;
    let user_room = '';

    /**
     * User Joins to the global room
     */
    socket.on('join', function ({ name, room }) {
        addUser({id, name, room}); // add user to users array
        user_room = room;
        socket.join(user_room);
        socket.join(id);
        socket.emit('user_joined', users);
        socket.broadcast.emit('user_joined', users); // emit event with modified users array
    })

    /**
     * On user challenge
     */


    socket.on('challenge', socketId => {
        io.to(socketId).emit('accept', id);
    })

    /**
     * User Disconnect function
     */
    socket.on('disconnect', () => {
        socket.leave(user_room);
        socket.leave(id);
        removeUser(id); // remove user form users array
        socket.emit('user_left', users);
        socket.broadcast.emit('user_left', users);  // emit event with modified users
    })


})


app.use(router);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))