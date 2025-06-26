import {createBrowserRouter} from "react-router-dom";
import App from "../App.jsx";
import Login from "../app/Login.jsx";
import SignUp from "../app/SignUp.jsx";
import Dashboard from "../app/Dashboard.jsx";
import ChatRoom from "../app/ChatRoom.jsx";
import Todo from "../app/Todo.jsx";
import ErrorPage from "../app/ErrorPage.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Dashboard />
            },
            {
                path: "/todo",
                element: <Todo />
            },
            {
                path: "/chat",
                element: <ChatRoom />
            },
        ]

    },

    {
        path: "/login",
        element: <Login />,
    },

    {
        path: "/register",
        element: <SignUp />,
    },

    {  path: "*",
        element: <ErrorPage />,
    }
]);

export default router;