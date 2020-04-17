import {useState} from 'react'
import PlayerStats from './PlayerStats';
import GameBoard from './GameBoard';

export default function GameUI() {
    const [player, setPlayer] = useState({})
    const [opponent, setOpponent] = useState({})

    return (
        <div className='game-board-ui-wrap'>
            <div className="game-board-ui">
                <PlayerStats player={player}/>
                <GameBoard />
                <PlayerStats player={opponent}/>
            </div>
        </div>
    )
}
