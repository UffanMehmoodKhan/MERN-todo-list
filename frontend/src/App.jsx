import {Link, Outlet} from "react-router-dom";
import NavBar from "./app/components/NavBar";
import Footer from "./app/components/Footer";

function App() {

    return (<>
        <NavBar/>
        <Outlet/>
        <Footer />
    </>)
}

export default App
