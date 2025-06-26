export default function Dashboard() {

    const username = localStorage.getItem('username');

    return (<div className={"dashboard-container"}>
            <h1>Welcome to the Dashboard, {username}!</h1>
        </div>

    );
}