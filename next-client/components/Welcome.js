import Players from './Players';

export default function Welcome() {
    return (
        <div className="welcome">
            <div className="welcome-inner">
                <h1>Tic-Toc-Toe Online</h1>
                <Players />
            </div>
        </div>
    )
}