import Head from 'next/head'

export default function CustomHead() {
    return (
        <Head>
            <title>Tic Tac Toe</title>
            <link key='favicon' rel="icon" href="/favicon.ico" />
            <link key='font' href="https://fonts.googleapis.com/css2?family=Fondamento:ital@0;1&family=Hind+Siliguri:wght@400;700&display=swap" rel="stylesheet" /> 
        </Head>
    )
}
