import Head from '../components/Head';
export default function Layout(props) {
    return (
        <div className="page" id="page">
            <Head />
            {props.children}
        </div>
    )
}
