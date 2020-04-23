<template>
    <div v-bind:class="['player-list', isCurrentPlayerClass, isPlayingClass]">
        <div class="player-thumbnail">
            <span v-bind:style="avatarBg">{{player.name.substring(0, 2)}}</span>
        </div>
        <div class="player-info">
            <div class="player-info-left">
                <h4>{{player.name}}</h4>
                <span>Joined: {{joinedAt}}</span>
            </div>
            <button v-bind:disabled="player.isCurrentUser" v-on:click="onChallenge" class="button">{{button}}</button>
        </div>
    </div>
</template>

<script>
    import { format } from 'timeago.js';
    import randomColor from '../helpers/randomColor';

    export default {
        props: ['player', 'socket'],
        computed: {
            joinedAt() {
                return format(this.player.joined_at);
            }
        },
        data() {
            return {
                button: this.player.isCurrentUser ? 'It\'s You!' : 'Challenge',
                isCurrentPlayerClass: `current-user-${this.player.isCurrentUser}`,
                isPlayingClass: `is-playing-${this.player.playing}`,
                avatarBg: {
                    background: randomColor()
                }
            }
        },
        methods: {
            onChallenge() {
                if(this.player.isCurrentUser || this.player.playing) return;
                this.$emit('on-challenge', this.player.id);
                this.button = 'Waiting';
            }
        },
        mounted() {

            /**
             * Watch if opponent is rejected
             */

            if (this.player.playing) {
                this.button = 'In a match!';
            }

            this.socket.off('rejected');
            this.socket.on('rejected', (id) => {
                if(this.player.id === id){
                    this.button = 'Rejected';
                    setTimeout(() => {
                        this.button = 'Challenge';
                    }, 2000)
                }
            })
        }
    }
</script>
