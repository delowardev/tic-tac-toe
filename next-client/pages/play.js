import { useEffect, useRef } from 'react';
import { useBeforeunload } from 'react-beforeunload';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import GameBoard from '../components/GameBoard';
import io from 'socket.io-client';
import Router from 'next/router';
import SOCKET_SERVER_ORIGIN from '../server';


export default function play() {
    const router = useRouter();
    const socket = useRef(io(SOCKET_SERVER_ORIGIN));
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
            socket.current.emit('player_left_match', match);
            socket.current.emit('disconnect');
            socket.current.off();
            socket.current.disconnect();
        }

    }, []);



    useBeforeunload(() => {
        socket.current.emit('player_left_match', match);
        return true;
    });


    return (
        <Layout>
            <GameBoard match={match} socket={socket}/>
        </Layout>
    )
}
