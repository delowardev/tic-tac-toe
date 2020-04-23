<template>
    <GameBoard v-bind:socket="socket" v-bind:match="match"/>
</template>

<script>
    import io from 'socket.io-client';
    import GameBoard from '../components/GameBoard';
    import SOCKET_SERVER_ORIGIN from "../../server";

    export default {
        components: {
            GameBoard
        },
        data() {
            return {
                socket: io(SOCKET_SERVER_ORIGIN),
                match: this.$route.params.match,
                name: this.$route.params.name
            }
        },
        methods: {
            beforeBorwserUnload() {
                this.playerLeftMatch();
            },
            playerLeftMatch() {
                this.socket.emit('player_left_match', this.match);
            }
        },
        beforeCreate() {
            if(!this.$route.params.match) {
                this.$router.push('/');
            }
        },
        mounted() {
            this.socket.on('connect', () => {

                this.socket.emit('join', {
                    name: this.name,
                    room: this.match,
                    playing: true,
                    joined_at: Date.now()
                });

                this.socket.emit('player_joined', {
                    name: this.name,
                    match: this.match,
                    socketId: this.socket.id
                });
            });
            window.addEventListener('unload', this.beforeBorwserUnload);
        },

        beforeDestroy() {
            this.playerLeftMatch();
            this.socket.emit('disconnect');
            this.socket.off();
            this.socket.disconnect();
            window.removeEventListener('unload', this.beforeBorwserUnload);
        }
    }
</script>
