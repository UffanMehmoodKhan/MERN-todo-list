import "../styles/dashboard.css"
import logo from "../assets/img.png";
import chat from "../assets/chat.png";
import todo from "../assets/todo.png";

export default function Dashboard() {

    const username = localStorage.getItem('username');

    return (<div>
            <div className={"dashboard-container"}>
                <aside className={"dashboard-aside"}>
                    <h1>Welcome to the Dashboard, {username}!</h1>
                    <h4 style={{fontFamily: ""}}>View your tasks and chat with other members of the QR Family!</h4>
                </aside>

                <div className={"dashboard-logo"}>
                    <img
                        src={logo}
                        width={"110%"}
                    />
                </div>
            </div>

            <div className={"dashboard-todo-container"}>

                <div className={"dashboard-todo-img"}>
                    <img
                        src={todo}
                        width={"90%"}
                        height={"auto"}
                    />
                </div>

                <aside className={"dashboard-todo-aside"}>
                    <h1 style={{color: "#646cff"}}>View your current tasks and todo list!</h1>
                    <h4>Add and delete tasks that you must complete!</h4>
                </aside>
            </div>

            <div className={"dashboard-chat-container"}>
                
                <aside className={"dashboard-chat-aside"}>
                    <h1 style={{color: "#646cff"}}>Chat with your colleagues!</h1>
                    <h4>Experience encrypted chatting and real-time interface.</h4>
                </aside>
                <div className={"dashboard-chat-img"}>
                    <img
                        src={chat}
                        width={"102%"}
                        height={"auto"}
                    />
                </div>
            </div>
        </div>


    );
}