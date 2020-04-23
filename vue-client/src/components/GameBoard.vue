<template>
    <div v-if="players.length > 1" class="game-board-ui-wrap">
        <div v-if="winner" class="winner common-popup">
            <div class="winner-inner popup-inner">
                <img v-bind:src="require(`../assets/emoji/${winner === me.socketId ? 'party' : 'sad'}.svg`)"/>
                <h3>{{winner === me.socketId ? 'You' : 'Opponent'}} won the match!</h3>
                <div class="btn-group">
                    <router-link to="/">&#x21D6; Back to Lobby</router-link>
                </div>
            </div>
        </div>

        <div v-if="playerLeft" class="player-left common-popup">
            <div class="popup-inner">
                <img src="../assets/emoji/sad.svg"/>
                <h3>{{opponent.name}} left the match!</h3>
                <div class="btn-group">
                    <router-link to="/">&#x21D6; Back to Lobby</router-link>
                </div>
            </div>
        </div>

        <Player v-bind:player="me" v-bind:socket="socket" v-bind:moves="myMoves" v-bind:opponentMoves="opponentMoves" v-bind:activePlayer="activePlayer" v-bind:isMe="true"/>
        <div class="game-board-ui">
            <div class="game-board">
                <ul>
                    <li v-bind:class="'box-type-' + getBoxImage(index + 1)" v-for="(box, index) in Array(9).fill(0)" v-on:click="onClickBox(index + 1)" v-bind:key="index">
                        <img v-if="getBoxImage(index + 1)" v-bind:src="require(`../assets/${getBoxImage(index + 1)}.png`)" alt="">
                    </li>
                </ul>
            </div>
            <div class="game-board-emoji">
                <button v-for="(emoji, index) in emotes" v-on:click="onClickEmoji(emoji)" v-bind:key="index">
                    <img v-bind:src="require(`../assets/emoji/${emoji}.svg`)" v-bind:alt="emoji">
                </button>
            </div>
        </div>
        <Player v-bind:player="opponent" v-bind:socket="socket" v-bind:moves="opponentMoves" v-bind:opponentMoves="myMoves" v-bind:activePlayer="activePlayer" v-bind:isMe="false"/>
    </div>
</template>

<script>
    import Player from './Player';

    const WINNING_COMBO = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7]
    ]; // TODO: this combo needs to be dynamic

    export default {
        props: ['socket', 'match'],
        components: {
            Player
        },
        data() {
            return {
                players: [],
                me: null,
                opponent: null,
                myMoves: [],
                opponentMoves: [],
                activePlayer: null,
                winner: null,
                myWinningChance: 50,
                opponentWinningChance: 50,
                emotes: ['like', 'smile', 'grinning', 'heart', 'tired', 'sad', 'angry', 'party'],
                playerLeft: false
            }
        },
        methods: {
            onClickEmoji(emote) {
                this.socket.emit('emote', {
                    emote,
                    from: this.me.socketId,
                    to: this.opponent.socketId,
                    match: this.match
                });
            },
            onClickBox(index) {

                const inMyMove = this.myMoves.indexOf(index);
                const inOpponentMove = this.opponentMoves.indexOf(index);
                const isDisabled = inMyMove > -1 || inOpponentMove > -1 || this.activePlayer !== this.me.socketId;
                if (!this.players.length || isDisabled) return;

                this.socket.emit('move', {
                    userID: this.me.socketId,
                    opponentId: this.opponent.socketId,
                    match: this.match,
                    index
                });

            },
            getBoxImage(index) {
                const inMyMove = this.myMoves.indexOf(index);
                const inOpponentMove = this.opponentMoves.indexOf(index);
                return inMyMove > -1 ? 'xx' : (inOpponentMove > -1 ? 'oo' : false);
            },
            hasSubArray(master, sub) {
                return sub.every((i => v => i = master.indexOf(v, i) + 1)(0));
            },
            decideWinner() {
                /**
                 * Decide winner
                 */
                const myMoveSorted = this.myMoves.sort();
                const opponentMoveSorted = this.opponentMoves.sort();

                if(myMoveSorted.length > 2){
                    WINNING_COMBO.forEach(combo => {
                        if(this.hasSubArray(myMoveSorted, combo)) {
                            this.winner = this.me.socketId;
                        }
                    });
                }

                if(opponentMoveSorted.length > 2){
                    WINNING_COMBO.forEach(combo => {
                        if(this.hasSubArray(opponentMoveSorted, combo)) {
                            this.winner = this.opponent.socketId
                        }
                    });
                }
            }
        },
        created() {
            this.socket.on('connect', () => {
                const sid = this.socket.id;
                /**
                 * Watch joined event and update state
                 */
                this.socket.off('player_joinded');
                this.socket.on('player_joined', (match) => {
                    this.players = match;
                    this.me = match.find(p => p.socketId === sid);
                    this.opponent = match.find(p => p.socketId !== sid);
                    this.activePlayer = match[0].socketId;
                });

                /**
                 * Watch move event an update sate
                 */
                this.socket.on('move', ({index, userID, opponentId}) => {
                    this.activePlayer = opponentId;
                    if(sid === userID) {
                        this.myMoves = [...this.myMoves, index];
                    }else{
                        this.opponentMoves = [...this.opponentMoves, index];
                    }
                    this.decideWinner();
                });

                /**
                 * Watch on opponent left the match
                 */

                this.socket.on('player_left_match', () => {
                    this.playerLeft = true;
                    this.socket.emit('destroy_match', this.match)
                })

            });
        }
    }
</script>
