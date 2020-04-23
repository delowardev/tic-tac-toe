import {useEffect, useState} from "react";

const CurrentPlayer = ({player, move, opponentMove, activePlayer, socket, isMe}) => {

    const [emote, setEmote] = useState('');
    const [emoteClass, setEmoteClass] = useState('');
    const [myWinningChance, setMyWinningChance] = useState(50);
    const [myAvailableCombo, setMyAvailableCombo] = useState(8);

    useEffect(() => {

        socket.current.on('emote_from', data => {
            setEmote(data.from === player.socketId ? data.emote : '');
            setEmoteClass('active');
            setTimeout(() => setEmoteClass(''), 1000)
        });

        socket.current.on('emote_to', data => {
            setEmote(data.from === player.socketId ? data.emote : '');
            setEmoteClass('active');
            setTimeout(() => setEmoteClass(''), 1000)
        });

    },[]);

    useEffect(() => {

        /**
         * Winning chance
         */

        let winningChances = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9],

            [1, 4, 7],
            [2, 5, 8],
            [3, 6, 9],

            [1, 5, 9],
            [3, 5, 7]
        ];

        let myChances = [];
        let opponentChances = [];
        let wastedChances = [];

        for(let i = winningChances.length; i > 0; i--){
            const index = i - 1;
            const chance = winningChances[index];

            const inMyMove = chance.some(a => move.includes(a));
            const inOpponentMove = chance.some(a => opponentMove.includes(a));

            if(inMyMove && inOpponentMove) {
                wastedChances.push(chance);
                winningChances.splice(index, 1);
            } else if(inMyMove) {
                myChances.push(chance);
                winningChances.splice(index, 1);
            } else if(inOpponentMove) {
                opponentChances.push(chance);
                winningChances.splice(index, 1);
            }
        }

        const myChanceCount = myChances.length + winningChances.length;
        const opponentChanceCount = opponentChances.length + winningChances.length;
        const totalChanceCount = myChanceCount + opponentChanceCount;

        const myPercent = Math.round(myChanceCount * (100 / totalChanceCount));
        // const opponentPercent = Math.round(opponentChanceCount * (100 / totalChanceCount));

        setMyAvailableCombo(myChanceCount);
        setMyWinningChance(myPercent);

    }, [move, opponentMove]);


    return (
        <div className={`current-player ${activePlayer === player.socketId ? 'active-player' : ''}`}>
            {activePlayer === player.socketId && <span className="current-turn">{isMe ? 'Your Turn' : 'Opponent\'s Turn'}</span>}
            <span className="player-avatar">{(player.name || '').substring(0, 2)}</span>
            <h4 className="player-name">{player.name} {isMe && '(You)'}</h4>
            <div className="player-move-count-wrap">
                <div className="player-move-count player-move-count-empty">
                    {
                        Array(5).fill(0).map((_, index) => (
                            <span key={index}>X</span>
                        ))
                    }
                </div>
                <div className="player-move-count player-move-count-fill">
                    {
                        Array(move.length).fill(0).map((_, index) => (
                            <span key={index}>X</span>
                        ))
                    }
                </div>
            </div>
            <div className='winning-chance'><span>{myWinningChance}%</span> Winning Chance</div>
            <div className={'winning-combination'}><span>{myAvailableCombo}</span> winning combination available</div>
            { emote && <div className={`message-box ${emoteClass}`}><img src={`/emoji/${emote}.svg`}/></div>}
        </div>
    );
};

export default CurrentPlayer;
