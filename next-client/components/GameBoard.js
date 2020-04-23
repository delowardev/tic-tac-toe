import {useEffect, useState} from "react";
import CurrentPlayer from "./CurrentPlayer";
import Link from 'next/link';

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
    const [winner, setWinner] = useState(null);
    const [playerLeft, setPlayerLeft] = useState(false);


    const WINNING_COMBO = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],

        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],

        [1, 5, 9],
        [3, 5, 7]
    ];


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

            /**
             * Watch joined event and update state
             */
            socket.current.off('player_joinded');
            socket.current.on('player_joined', (match) => {
                const cid = socket.current.id;
                setPlayers(match);
                setMe(match.find(p => p.socketId === cid));
                setOpponent(match.find(p => p.socketId !== cid));
                setActivePlayer(match[0].socketId);
            });

            /**
             * Watch move event an update sate
             */
            socket.current.on('move', ({index, userID, opponentId}) => {
                setActivePlayer(opponentId);
                if(socket.current.id === userID) {
                    setMyMove(prev => [...prev, index]);
                }else{
                    setOpponentMove(prev => [...prev, index]);
                }
            });

        });

        /**
         * Run before unmount
         */
        return () => {
            socket.current.emit('disconnect');
            socket.current.off();
            socket.current.disconnect();
        }

    }, []);

    const hasSubArray = (master, sub) => {
        return sub.every((i => v => i = master.indexOf(v, i) + 1)(0));
    };

    useEffect(() => {
        socket.current.on('player_left_match', () => {
            setPlayerLeft(true);
            socket.current.emit('destroy_match', match)
        });
    }, [match, playerLeft]);


    useEffect(() => {
        /**
         * Decide winner
         */
        const myMoveSorted = myMove.sort();
        const opponentMoveSorted = opponentMove.sort();

        if(myMoveSorted.length > 2){
            WINNING_COMBO.forEach(combo => {
                if(hasSubArray(myMoveSorted, combo)) {
                    setWinner(me.socketId);
                }
            });
        }

        if(opponentMoveSorted.length > 2){
            WINNING_COMBO.forEach(combo => {
                if(hasSubArray(opponentMoveSorted, combo)) {
                    setWinner(opponent.socketId);
                }
            });
        }

    }, [myMove, opponentMove]);

    const onClickEmote = emote => {
        socket.current.emit('emote', {emote, from: me.socketId, to: opponent.socketId, match});
    };

    return players.length > 1 ? (
        <div className='game-board-ui-wrap'>

            {
                winner && <div className="common-popup">
                    <div className="popup-inner">
                        <img src={`/emoji/${winner === me.socketId ? 'party' : 'sad'}.svg`}/>
                        <h3>{winner === me.socketId ? 'You' : 'Opponent'} won the match!</h3>
                        <div className="btn-group">
                            <Link href='/'><a className="button">Go Back</a></Link>
                        </div>
                    </div>
                </div>
            }

            {
                playerLeft && (
                    <div className="common-popup">
                        <div className="popup-inner">
                            <img src={'/emoji/sad.svg'}/>
                            <h3>{opponent.name} left the match!</h3>
                            <div className="btn-group">
                                <Link href='/'><a className="button">Go Back</a></Link>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                me && <CurrentPlayer isMe={true} socket={socket} activePlayer={activePlayer} player={me} move={myMove} opponentMove={opponentMove}/>
            }

            <div className="game-board-ui">
                <div className="game-board">
                    <ul>
                        {
                            Array(9).fill(0).map((box, key) => {

                                const inMyMove = myMove.indexOf(key + 1);
                                const inOpponentMove = opponentMove.indexOf(key + 1);
                                const image = inMyMove > -1 ? 2 : (inOpponentMove > -1 ? 1 : 0);
                                const isDisabled = inMyMove > -1 || inOpponentMove > -1 || !me || (activePlayer !== me.socketId);

                                return (
                                    <li
                                        className={`box-type-${image}`}
                                        onClick={() => handleClick(key + 1, isDisabled)} key={key}
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
                opponent && <CurrentPlayer isMe={false} socket={socket} activePlayer={activePlayer} player={opponent} move={opponentMove} opponentMove={myMove}/>
            }
        </div>
    ) : null
}
