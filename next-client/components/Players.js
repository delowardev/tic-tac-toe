import { useState, useEffect } from 'react';
import Player from './Player';
import io from 'socket.io-client';
import faker from 'faker';

let socket;

export default function Players() {

    const [players, setPlayers] = useState([]);

    const ENDPOINT = 'localhost:5000';
    socket = io(ENDPOINT);

    useEffect(() => {
        const name = faker.name.firstName() + ' ' + faker.name.lastName();
        socket.emit('join', {name, room: 'global'});

        return () => {
            socket.emit('disconnect');
            socket.off();
        }

    }, [])

    useEffect(() => {
        
        socket.on('user_joined', (users) => {
            setPlayers(users);
        });

        socket.on('user_left', (users) => {
            setPlayers(users);
        }); 

    }, [players]);


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
