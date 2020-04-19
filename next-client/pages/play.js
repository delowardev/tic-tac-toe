import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import GameBoard from '../components/GameBoard';
import io from 'socket.io-client';
import Router from 'next/router'


export default function play() {
    const router = useRouter();
    const socket = useRef(io('http://127.0.0.1:5000'));
    const {name, match} = router.query;

    useEffect(() => {

        if (typeof router.query.match === 'undefined' || typeof router.query.name === 'undefined') {
            Router.push('/');
        }

        socket.current.on('connect', () => {
            socket.current.emit('join', { name, room: match, playing: true });
            socket.current.emit('player_joined', {
                name,
                match,
                socketId: socket.current.id
            });
        });

        /**
         * Run before unmount
         */
        return () => {
            socket.current.emit('disconnect');
            socket.current.off();
            socket.current.disconnect();
        }

    }, []);


    return (
        <Layout>
            {/*<CurrentPlayers socket={socket}/>*/}
            <GameBoard match={match} socket={socket}/>
        </Layout>
    )
}
