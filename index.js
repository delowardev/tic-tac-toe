const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const router = require('./router');
const { addUser, removeUser, getUser, getUsersInRoom, users } = require('./users');

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);



io.on('connection', function (socket) {
    const id = socket.id;

    /**
     * User Join Function
     */
    socket.on('join', function ({ name, room }) {
        const { user } = addUser({id, name, room}); // add user to users array
        // socket.join(user.room);
        socket.emit('user_joined', users); // emit event with modified users array
        console.log(id, 'joined')
    })

    /**
     * User Disconnect function
     */
    socket.on('disconnect', () => {
        removeUser(id); // remove user form users array
        socket.emit('user_left', users);  // emit event with modified users
        console.log(id, 'left')
    })


})


app.use(router);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))