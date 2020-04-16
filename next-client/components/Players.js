import { useState } from 'react';
import Player from './Player';

export default function Players() {
    const DEFAULT_PLAYER = [
        {
            id: 'STATIC_99',
            name: 'Toc Bot',
            joined_at: ''
        },
        {
            id: 'STATIC_98',
            name: 'Tic Bot',
            joined_at: ''
        },
        {
            id: 'STATIC_97',
            name: 'Tic Bot',
            joined_at: ''
        },
        {
            id: 'STATIC_96',
            name: 'Tic Bot',
            joined_at: ''
        },
        {
            id: 'STATIC_95',
            name: 'Tic Bot',
            joined_at: ''
        },
        {
            id: 'STATIC_94',
            name: 'Tic Bot',
            joined_at: ''
        }
    ]
    const [players, setPlayers] = useState([...DEFAULT_PLAYER])

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
