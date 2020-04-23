<template>
    <div class="online-player-card-wrap">
        <div class='online-players-card'>
            <div class="player-card-header">
                <h3>Players Online</h3>
                <span class="player-online-count">{{players.length}}</span>
            </div>
            <div class="player-card-body">
                <template v-for="player in players">
                    <User @on-challenge="onChallenge" v-bind:key="player.id" v-bind:socket="socket" v-bind:player="player" />
                </template>
            </div>
        </div>
        <div v-if="challengedBy !== null" class="challenged-by-popup common-popup">
            <div class="challenged-by-popup-inner popup-inner">
                <img src="../assets/emoji/smile.svg"/>
                <h3>Can You Beat Me???</h3>
                <p>{{challengedBy.name}} challenged you.</p>
                <div class="challenged-btns btn-group">
                    <button v-on:click="onClickPlay" class="button accept-btn">Play Now</button>
                    <button v-on:click="onClickReject" class="button reject-btn">Not Now</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import io from 'socket.io-client';
    import faker from 'faker';
    import User from './User';
    import { nanoid } from 'nanoid';
    import SOCKET_SERVER_ORIGIN from '../../server';

    export default {
        name: 'Players',
        components: {
            User
        },
        data() {
            return {
                players: [],
                challengedBy: null,
                socket: io(SOCKET_SERVER_ORIGIN)
            }
        },
        methods: {
            getPlayerByID(id) {
                return this.players.find(player => player.id === id)
            },
            onChallenge(challengeFromId) {
                this.socket.emit('challenge', challengeFromId);
            },
            onClickPlay() {
                const player = this.getPlayerByID(this.socket.id);
                this.socket.emit('accepted', { player, opponent: this.challengedBy, matchID: nanoid()});
            },
            onClickReject() {
                this.socket.emit('rejected', this.challengedBy.id);
                this.challengedBy = null;
            }
        },
        mounted() {

            /**
             * Join user to the global room
             */
            this.socket.emit('join', {
                name: faker.name.firstName(),
                room: 'global',
                joined_at: Date.now()
            });

            /**
             * Watching socket events
             * Update users when new user join or leave
             */
            this.socket.off('user_joined');
            this.socket.on('user_joined', users => {
                users.map(user => user.isCurrentUser = user.id === this.socket.id);
                this.players = users;
            });

            this.socket.off('user_left');
            this.socket.on('user_left', users => {
                users.map(user => user.isCurrentUser = user.id === this.socket.id);
                this.players = users;
            });

            this.socket.off('accept');
            this.socket.on('accept', reqUserID => {
                const reqFromUser = this.getPlayerByID(reqUserID);
                if(reqFromUser) {
                    this.challengedBy = reqFromUser
                }
            });

            this.socket.off('accepted');
            this.socket.on('accepted', ({ matchID }) => {
                const name = this.getPlayerByID(this.socket.id).name;

                this.$router.push({
                    name: 'Play',
                    params: {
                        name,
                        match: matchID
                    }
                })

            });

        },
        beforeDestroy() {
            this.socket.emit('disconnect');
            this.socket.off();
            this.socket.disconnect();
        }
    }
</script>


