import { useEffect, useState } from "react";
import { format } from 'timeago.js';
import randomColor from "../helpers/randomColor";

const Player = ({ player, onChallenge, socket}) => {

    const [color, setColor] = useState('#9C27B0');
    const [button, setButton] = useState('Challenge');

    useEffect(() => {
        setColor(randomColor());

        if(player.isCurrentUser) {
            setButton('It\'s you!');
        }

        if (player.playing) {
            setButton('In a match!');
        }

        socket.current.off('rejected');
        socket.current.on('rejected', (id) => {
            if(player.id === id){
                setButton('Rejected');
                setTimeout(() => {
                    setButton('Challenge');
                }, 4000)
            }
        })


    }, []);

    const _handleClick = () => {
        if( player.isCurrentUser || player.playing ) return;
        onChallenge(player);
        setButton('Waiting...');
    };


    return typeof player.name !== 'undefined' ? (
        <div className={`player-list current-user-${player.isCurrentUser} is-playing-${player.playing}`}>
            <div className="player-thumbnail">
                <span style={{ background: color}}>{(player.name).substring(0, 2)}</span>
            </div>
            <div className="player-info">
                <div className="player-info-left">
                    <h4>{player.name}</h4>
                    <span>Joined: {format(player.joined_at)}</span>
                </div>
                <button onClick={_handleClick} disabled={player.isCurrentUser || player.playing} className='button'>{button}</button>
            </div>
        </div>
    ) : null
};

export default Player;
