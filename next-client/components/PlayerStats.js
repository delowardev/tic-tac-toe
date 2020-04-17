export default function PlayerStats(props) {
    return (
        <div className="current-player-wrap">
            <div className="current-player-inner">
                <div className="current-player-info">
                    <span className="plyer-thumb">AA</span>
                    <span className="player-number">Player 1</span>
                    <h4>Delowar</h4>
                    <div className="playing-icon">X</div>
                </div>
                <div className="player-match-stats">
                    <div className="player-move-count">
                        {
                            Array(5).fill(0).map((_, index) => (
                                <span className={index < 3 ? 'active' : ''} key={index}>X</span>
                            ))
                        }
                    </div>
                    <div className="player-winning-chance">
                        <div className="player-winning-progress"></div>
                        <span>Winning chance 68%</span>
                    </div>
                </div>

            </div>
        </div>
    )
}
