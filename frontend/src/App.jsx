import {Link, Outlet} from "react-router-dom";
import NavBar from "./app/components/NavBar";

function App() {

    return (<>
        <NavBar/>
        <Outlet/>
    </>)
}

export default App
