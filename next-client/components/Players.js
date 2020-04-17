import { useState, useEffect } from 'react';
import Player from './Player';
import io from 'socket.io-client';
import faker from 'faker';

let socket;

export default function Players() {

    const [players, setPlayers] = useState([]);
    const getName = () => faker.name.firstName() + ' ' + faker.name.lastName();

    useEffect(() => {

        const ENDPOINT = 'localhost:5000';
        socket = io.connect(ENDPOINT);

        socket.emit('join', {name: getName(), room: 'global'});

        socket.on('user_joined', (users) => {
            setPlayers(users);
        });

        socket.on('user_left', (users) => {
            setPlayers(users);
        }); 

        return () => {
            socket.emit('disconnect');
            socket.off();
        }

    }, [])
    return (
        <div className='online-players-card'>
            <div className="player-card-header">
                <h3>Players Online</h3>
                <span className="player-online-count">20</span>
            </div>
            <div className="player-card-body">
                {
                    players.map(player => <Player key={player.id} player={player}/>)
                }
            </div>
        </div>
    )
}
