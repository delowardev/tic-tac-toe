const match = {};

const addPlayer = (matchID, player) => {
    if ( !match.hasOwnProperty(matchID) ) {
        match[matchID] = [];
    } else if (match[matchID].length >= 2) {
        console.log('There is no room')
        return;
    }

    match[matchID].push(player);
    return player;
}

const getPlayersByMatch = matchID => match[matchID];
const destroyMatch = matchID => delete match[matchID];


module.exports = {match, addPlayer, destroyMatch, getPlayersByMatch}
