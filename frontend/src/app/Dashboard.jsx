

export default function Dashboard() {

    const username = localStorage.getItem('username');

    return (
        <div>
            <h1>Welcome to the Dashboard, {username}!</h1>
            <p>This is your personal dashboard where you can manage your tasks and chat with others.</p>
        </div>
    );
}