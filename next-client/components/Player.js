import { useEffect, useState } from "react";
// import TimeAgo from 'react-timeago';
import { format } from 'timeago.js';

function randomColor() {
    const COLOR = ['#f44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#FFC107', '#FF9800', '#FF5722'];
    const rand = Math.round(Math.random() * (COLOR.length - 0)) + 0;
    return COLOR[rand];
}

export default function Player({player}) {
    const [color, setColor] = useState('#9C27B0');
    useEffect(() => {
        setColor(randomColor())
    }, [])

    return (
        <div className={`player-list current-user-${player.isCurrentUser}`}>
            <div className="player-thumbnail">
                <span style={{ background: color}}>{player.name.substring(0, 2)}</span>
            </div>
            <div className="player-info">
                <div className="player-info-left">
                    <h4>{player.name}</h4>
                    <span>Joined: {format(player.joined_at)}</span>
                </div>
                <button disabled={player.isCurrentUser} className='button'>{player.isCurrentUser ? 'It\'s you!' : 'Challange'}</button>
            </div>
        </div>
    )
}
