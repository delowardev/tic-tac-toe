import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import GameUI from '../../components/GameUI';

export default function play() {
    const router = useRouter();
    const match = router.query.match;

    return (
        <Layout>
            <GameUI/>
        </Layout>
    )
}
