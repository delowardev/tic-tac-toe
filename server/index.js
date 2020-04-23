const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');


const router = require('./router');
const { addUser, removeUser, getUsers } = require('./users');
const { getMatch, addPlayer, destroyMatch } = require('./players');

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);


const io = socketio(server);

app.use(router);
app.use(cors());


io.on('connection', function (socket) {
    const id = socket.id;
    let user_room = '';

    /**
     * User Joins to the global room
     */
    socket.on('join', function ({ name, room, playing = false, joined_at }) {
        addUser({ id, name, room, playing, joined_at }); // add user to users array
        user_room = room;
        socket.join(user_room);
        socket.join(id);
        socket.emit('user_joined', getUsers());
        socket.broadcast.emit('user_joined', getUsers()); // emit event with modified users array
    });

    /**
     * Match Started
     */

    socket.on('player_joined', user => {
        const match = getMatch();
        addPlayer(user.match, user);
        if(match.hasOwnProperty(user.match) && match[user.match].length === 2){
            socket.emit('player_joined', match[user.match]);
            socket.broadcast.to(user.match).emit('player_joined', match[user.match]);
        }
    });

    socket.on('move', (data) => {
        socket.emit('move', data);
        socket.broadcast.to(data.match).emit('move', data);
    });

    socket.on('emote', (data) => {
        socket.emit('emote_from', data);
        socket.broadcast.to(data.match).emit('emote_to', data);
    });


    /**
     * On user challenge
     */


    socket.on('challenge', (socketId) => {
        io.to(socketId).emit('accept', id);
    });

    socket.on('rejected', (socketId) => {
        io.to(socketId).emit('rejected', id);
    });

    socket.on('accepted', data => {
        io.to(data.opponent.id).emit('accepted', data);
        socket.emit('accepted', data);
    });

    socket.on('player_left_match', match => {
        socket.broadcast.to(match).emit('player_left_match');
    });

    socket.on('destroy_match', match => {
        destroyMatch(match);
    });

    /**
     * User Disconnect function
     */
    socket.on('disconnect', () => {
        socket.leave(user_room);
        socket.leave(id);
        removeUser(id); // remove user form users array
        socket.emit('user_left', getUsers());
        socket.broadcast.emit('user_left', getUsers());  // emit event with modified users
    })


});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
