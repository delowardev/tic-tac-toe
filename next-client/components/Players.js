import { useState, useEffect, useRef } from 'react';
import Player from './Player';
import io from 'socket.io-client';
import faker from 'faker';

export default function Players() {

    const [players, setPlayers] = useState([]);
    const [challengedBy, setChallengedBy] = useState(null);
    const socket = useRef(io('ws://localhost:5000'));

    const getName = () => faker.name.firstName() + ' ' + faker.name.lastName();

    /**
     * Run once after mounted
     */
    useEffect(() => {

        /**
         * Emit events
         */
        socket.current.emit('join', {name: getName(), room: 'global'});

        /**
         * Watch events
         */
        socket.current.off('user_joined');
        socket.current.on('user_joined', users => {
            users.map(user => user.isCurrentUser = user.id === socket.current.id);
            setPlayers(users);
        });

        socket.current.off('user_left');
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

    /**
     * Run on every new player added or removed
     */
    useEffect(() => {
        socket.current.off('accept');
        socket.current.on('accept', reqUserID => {
            const reqFromUser = players.find(player => player.id === reqUserID);
            reqFromUser && setChallengedBy(reqFromUser);
        });

    }, [players]);


    const onChallenge = (user) => {
        socket.current.emit('challenge', user.id)
    }

    const RenderChallenge = () => {
        if(!challengedBy) return null;
        return (
            <div className="challenged-by-popup">
                <div className="challenged-by-popup-inner">
                    <h4>{challengedBy.name} challenged you!</h4>
                    <div className="challenged-btns">
                        <button className="button accept-btn">Play Now</button>
                        <button onClick={onClickReject} className="button reject-btn">Not Now</button>
                    </div>
                </div>
            </div>
        )
    }

    const onClickReject = () => {
        setChallengedBy(null);
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
            <RenderChallenge />
        </div>
    )
}
