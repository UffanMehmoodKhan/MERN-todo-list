import {createBrowserRouter} from "react-router-dom";
import App from "../App.jsx";
import Login from "../app/Login.jsx";
import SignUp from "../app/SignUp.jsx";
import Dashboard from "../app/Dashboard.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },

    {
        path: "/login",
        element: <Login />,
    },

    {
        path: "/register",
        element: <SignUp />,
    },

    {
        path: "/todo",
        element: <Dashboard />
    },

    {
        path: "*",
        element: <div>404 Not Found</div>,
    }
]);

export default router;