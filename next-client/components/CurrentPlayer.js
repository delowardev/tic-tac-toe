import {useEffect, useState} from "react";

const CurrentPlayer = ({player, move, activePlayer, socket, isMe}) => {

    const [emote, setEmote] = useState('');
    const [emoteClass, setEmoteClass] = useState('');

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


    return (
        <div className={`current-player ${activePlayer === player.socketId ? 'active-player' : ''}`}>
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
            <div className='winning-chance'>
                <span>49%</span>
                Winning Chance
            </div>
            { emote && <div className={`message-box ${emoteClass}`}><img src={`/emoji/${emote}.svg`}/></div>}
        </div>
    );
};

export default CurrentPlayer;
