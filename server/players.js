const match = {};

const addPlayer = (matchID, player) => {
    if ( !match.hasOwnProperty(matchID) ) {
        match[matchID] = [];
    } else if (match[matchID].length >= 2) {
        return;
    }
    match[matchID].push(player);
};

const destroyMatch = matchID => delete match[matchID];
const getMatch = () => match;

module.exports = {getMatch, addPlayer, destroyMatch};
