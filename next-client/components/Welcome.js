import Players from './Players';

export default function Welcome() {
    return (
        <div className="welcome">
            <div className="welcome-inner">
                <h1>Welcome to Tic-Toc-Toe <br />Game Board</h1>
                <Players />
            </div>
        </div>
    )
}
