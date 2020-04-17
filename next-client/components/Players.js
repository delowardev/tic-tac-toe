import { useState, useEffect, useRef } from 'react';
import Player from './Player';
import io from 'socket.io-client';
import faker from 'faker';

let socket;

export default function Players() {

    const [players, setPlayers] = useState([]);
    const socket = useRef(io.connect('http://localhost:5000'));
    const userId = useRef(null);

    const getName = () => faker.name.firstName() + ' ' + faker.name.lastName();

    useEffect(() => {

        socket.current.emit('join', {name: getName(), room: 'global'});
        socket.current.on('user_joined', ({ users, id, type}) => {
            if(type === 'current_user') {
                userId.current = id
            }
            users.map(user => user.isCurrentUser = user.id === userId.current);
            setPlayers(users);
        });

        socket.current.on('user_left', ({ users }) => {
            users.map(user => user.isCurrentUser = user.id === userId.current);
            setPlayers(users);
        }); 

        return () => {
            socket.current.emit('disconnect');
            socket.current.off();
        }

    }, []);

    return (
        <div className='online-players-card'>
            <div className="player-card-header">
                <h3>Players Online</h3>
                <span className="player-online-count">{players.length}</span>
            </div>
            <div className="player-card-body">
                {
                    players.map(player => <Player key={player.id} player={player}/>)
                }
            </div>
        </div>
    )
}
