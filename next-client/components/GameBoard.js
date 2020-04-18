export default function GameBoard({ boxes = [1, 0, 0, 0, 2, 0, 0, 1, 2], socket}) {

    const x = '/static/xx.png';
    const o = '/static/oo.png';

    const Image = ({type}) => type === 1 ? <img src={x} /> : (type === 2 ? <img src={o} /> : null);

    return (
        <div className='game-board-ui-wrap'>
            <div className="game-board-ui">
                <h4>Tic Tac Toe Online</h4>
                <div className="game-board">
                    <ul>
                        {
                            boxes.map((box, key) => (
                                <li className={`box-type-${box}`} key={key}><Image type={box}/></li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}