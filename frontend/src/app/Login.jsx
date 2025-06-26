import {useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import axiosInstance from "../api/axiosConfig.js";
import logo from "../assets/img.png";
import "../styles/login.css";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await axiosInstance.post('http://localhost:3000/login', {username, password});

            if (response.data.success) {
                console.log('Login successful:', response);
                localStorage.setItem('username', username);
                navigate('/');
            } else {
                console.error('Login failed:', response.data.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (

        <div className={"login-container"}>
            <div className={"login-logo"}>
                <img src={logo} alt="logo"/>
            </div>
            <div className={"login-form"}>
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username">Username: </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password: </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-light">Login</button>
                </form>
                <br/>
                <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
            </div>
        </div>);

}