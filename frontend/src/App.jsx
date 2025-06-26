import {Link, Outlet} from "react-router-dom";
import NavBar from "./app/components/NavBar";

function App() {

    return (<>
        <NavBar/>
        <div className="container-fluid">
            <Outlet />
        </div>
    </>)
}

export default App
