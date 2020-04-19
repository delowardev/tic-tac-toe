import {useEffect, useState} from "react";
import CurrentPlayer from "./CurrentPlayer";

/**
 * @return {null}
 */

export default function GameBoard({socket, match}) {

    if(!socket) return null;

    const [players, setPlayers] = useState([]);
    const [me, setMe] = useState(null);
    const [opponent, setOpponent] = useState(null);
    const [myMove, setMyMove] = useState([]);
    const [opponentMove, setOpponentMove] = useState([]);
    const [activePlayer, setActivePlayer] = useState(null);


    const x = '/static/xx.png';
    const o = '/static/oo.png';

    const emotes = {
        path: '/emoji/',
        names: ['like', 'smile', 'grinning', 'heart', 'tired', 'sad', 'angry', 'party']
    };

    const Image = ({type}) => type === 1 ? <img src={x} /> : (type === 2 ? <img src={o} /> : null);


    const handleClick = (index, isDisabled)  => {
        if(!players.length || isDisabled) return;
        socket.current.emit('move', {userID: me.socketId, opponentId: opponent.socketId, match, index});
    };


    useEffect(() => {
        socket.current.on('connect', () => {
            socket.current.off('player_joinded');
            socket.current.on('player_joined', (match) => {
                const cid = socket.current.id;
                setPlayers(match);
                setMe(match.find(p => p.socketId === cid));
                setOpponent(match.find(p => p.socketId !== cid));
                setActivePlayer(match[0].socketId);
            });
        });

    }, [players, me, opponent]);

    useEffect(() => {
        socket.current.on('connect', () => {
            socket.current.on('move', ({index, userID, opponentId}) => {
                setActivePlayer(opponentId);
                if(socket.current.id === userID) {
                    setMyMove(prev => [...prev, index]);
                }else{
                    setOpponentMove(prev => [...prev, index]);
                }
            });
        });

    }, [myMove, opponentMove, activePlayer]);

    useEffect(() => {

        /**
         * Run before unmount
         */
        return () => {
            socket.current.emit('disconnect');
            socket.current.off();
            socket.current.disconnect();
        }
    }, []);


    const onClickEmote = emote => {
        socket.current.emit('emote', {emote, from: me.socketId, to: opponent.socketId, match});
    };

    return players.length > 1 ? (
        <div className='game-board-ui-wrap'>

            {
                me && <CurrentPlayer socket={socket} activePlayer={activePlayer} player={me} move={myMove}/>
            }

            <div className="game-board-ui">
                { me && <h4>{activePlayer === me.socketId ? 'Your Turn' : 'Opponent\'s Turn'}</h4> }
                <div className="game-board">
                    <ul>
                        {
                            Array(9).fill(0).map((box, key) => {

                                const inMyMove = myMove.indexOf(key);
                                const inOpponentMove = opponentMove.indexOf(key);
                                const image = inMyMove > -1 ? 2 : (inOpponentMove > -1 ? 1 : 0);
                                const isDisabled = inMyMove > -1 || inOpponentMove > -1 || (!activePlayer || activePlayer !== me.socketId);

                                return (
                                    <li
                                        className={`box-type-${image}`}
                                        onClick={() => handleClick(key, isDisabled)} key={key}
                                    >
                                        <Image type={image}/>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="game-board-emoji">
                    {
                        emotes.names.map((emoji, ind) => (
                            <button onClick={() => onClickEmote(emoji)} key={ind}><img src={`${emotes.path + emoji}.svg`} alt={emoji}/></button>
                        ))
                    }
                </div>
            </div>

            {
                opponent && <CurrentPlayer socket={socket} activePlayer={activePlayer} player={opponent} move={opponentMove}/>
            }
        </div>
    ) : null
}
