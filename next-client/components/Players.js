import { useState, useEffect, useRef } from 'react';
import Player from './Player';
import io from 'socket.io-client';
import faker from 'faker';

export default function Players() {

    const [players, setPlayers] = useState([]);
    const [popup, setPopup] = useState(false);
    const socket = useRef(io('localhost:5000'));

    const getName = () => faker.name.firstName() + ' ' + faker.name.lastName();

    useEffect(() => {

        /**
         * Emit events
         */
        socket.current.emit('join', {name: getName(), room: 'global'});

        /**
         * Watch events
         */
        socket.current.on('user_joined', users => {
            users.map(user => user.isCurrentUser = user.id === socket.current.id);
            setPlayers(users);
        });

        socket.current.on('user_left', users => {
            users.map(user => user.isCurrentUser = user.id === socket.current.id);
            setPlayers(users);
        });

        /**
         * Run before unmount
         */
        return () => {
            socket.current.emit('disconnect');
            socket.current.off();
        }

    }, []);

    useEffect(() => {
        socket.current.off('accept');
        socket.current.on('accept', reqUserID => {
            const reqFromUser = players.find(player => player.id === reqUserID);
            console.log(reqUserID, reqFromUser)
        });

    }, [players]);

    const onChallenge = (user) => {
        socket.current.emit('challenge', user.id)
    }

    const renderChallenge = (user) => {
        if(!user) return;
        return (
            <div className="challenge-popup">
                <h4>{user.name} invited you</h4>
                <div className="chalenge-popup-btns">
                    <button>Accept</button>
                    <button>Reject</button>
                </div>
            </div>
        )
    }

    return (
        <div className="online-player-card-wrap">
            <div className='online-players-card'>
                <div className="player-card-header">
                    <h3>Players Online</h3>
                    <span className="player-online-count">{players.length}</span>
                </div>
                <div className="player-card-body">
                    {
                        players.map(player => <Player onChallenge={onChallenge} socket={socket} key={player.id} player={player} />)
                    }
                </div>
            </div>
        </div>
    )
}
