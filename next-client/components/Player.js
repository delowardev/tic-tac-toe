
function randomColors() {
    const COLOR = ['#f44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#FFC107', '#FF9800', '#FF5722'];
    const rand = Math.round(Math.random() * (COLOR.length - 0)) + 0;
    return COLOR[rand];
}

export default function Player({player}) {
    const color = randomColors();
    return (
        <div className='player-list'>
            <div className="player-thumbnail">
                <span style={{ background: color}}>{player.name.substring(0, 2)}</span>
            </div>
            <div className="player-info">
                <div className="player-info-left">
                    <h4>{player.name}</h4>
                    <span>Joned: 3 minutes ago</span>
                </div>
                <button className='button'>Challange</button>
            </div>
        </div>
    )
}
