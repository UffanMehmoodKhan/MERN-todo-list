import './App.css'
import {Link} from "react-router-dom";
import "../src/styles/app.css"

function App() {

  return (
    <>
        <div className={"nav-bar"}>

            <Link to={"/login"}>Login</Link>
            <Link to={"/register"}>SignUp</Link>

        </div>
        <h1>To-Do List</h1>

    </>
  )
}

export default App
