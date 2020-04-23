<template>
    <div v-bind:class="'current-player ' + (activePlayer === player.socketId ? 'active-player' : '')">
    <span v-if="activePlayer === player.socketId" class="current-turn">{{isMe ? 'Your Turn' : 'Opponent\'s Turn'}}</span>
    <span class="player-avatar">{{(player.name || '').substring(0, 2)}}</span>
    <h4 class="player-name">{{player.name}} {{isMe ? '(You)' : ''}}</h4>
    <div class="player-move-count-wrap">
        <div class="player-move-count player-move-count-empty">
            <span v-for="(_, i) in Array(5).fill(0)" v-bind:key="i">{{isMe ? 'X' : 'O'}}</span>
        </div>
        <div class="player-move-count player-move-count-fill">
            <span v-for="(_, i) in Array(moves.length).fill(0)" v-bind:key="i">{{isMe ? 'X' : 'O'}}</span>
        </div>
    </div>
    <div class='winning-chance'><span>{{myWinningChance}}%</span> Winning Chance</div>
    <div class="winning-combination"><span>{{myAvailableCombo}}</span> winning combination available</div>
        <div v-if="emote" v-bind:class="`message-box ${emoteClass}`">
            <img v-bind:src="require(`../assets/emoji/${emote}.svg`)" alt="">
        </div>
    </div>
</template>

<script>
    export default {
        props: [
            'player',
            'moves',
            'opponentMoves',
            'activePlayer',
            'socket',
            'isMe'
        ],
        watch: {
            moves() {
                this.setWinningChance();
            },
            opponentMoves() {
                this.setWinningChance();
            }
        },
        data() {
            return {
                emote: '',
                emoteClass: '',
                myWinningChance: 50,
                myAvailableCombo: 8
            }
        },
        methods: {
            setEmote(data) {
                this.emote = data.from === this.player.socketId ? data.emote : '';
                this.emoteClass = 'active';
                setTimeout(() => this.emoteClass = '', 1000)
            },
            setWinningChance() {
                let winningChances = [
                    [1, 2, 3],
                    [4, 5, 6],
                    [7, 8, 9],
                    [1, 4, 7],
                    [2, 5, 8],
                    [3, 6, 9],
                    [1, 5, 9],
                    [3, 5, 7]
                ]; // TODO: this array should be dynamic

                let myChances = [];
                let opponentChances = [];
                // let wastedChances = [];

                for(let i = winningChances.length; i > 0; i--){
                    const index = i - 1;
                    const chance = winningChances[index];

                    const inMyMove = chance.some(a => this.moves.includes(a));
                    const inOpponentMove = chance.some(a => this.opponentMoves.includes(a));

                    if(inMyMove && inOpponentMove) {
                        // wastedChances.push(chance);
                        winningChances.splice(index, 1);
                    } else if(inMyMove) {
                        myChances.push(chance);
                        winningChances.splice(index, 1);
                    } else if(inOpponentMove) {
                        opponentChances.push(chance);
                        winningChances.splice(index, 1);
                    }
                }

                const myChanceCount = myChances.length + winningChances.length;
                const opponentChanceCount = opponentChances.length + winningChances.length;
                const totalChanceCount = myChanceCount + opponentChanceCount;

                const myPercent = Math.round(myChanceCount * (100 / totalChanceCount));
                // const opponentPercent = Math.round(opponentChanceCount * (100 / totalChanceCount));

                this.myAvailableCombo = myChanceCount;
                this.myWinningChance = myPercent;
            }
        },
        mounted() {
            this.socket.on('emote_from', data => this.setEmote(data));
            this.socket.on('emote_to', data => this.setEmote(data));
            this.setWinningChance();
        }
    }
</script>
