import "../styles/signup.css";
import {useState} from "react";
import axiosInstance from "../api/axiosConfig.js";
import {Link, useNavigate} from "react-router-dom";
import logo from "../assets/img.png";

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (event) => {
        event.preventDefault();

        try {
            const response = await axiosInstance
                .post('/register', {username, email, password})
                .then((response) => response, (error) => {
                    console.error('Signup error:', error);
                    throw error;
                });

            if (response.data.success) {
                console.log('Signup successful:', response.data.message);
                navigate('/login');
            } else {
                console.error('Signup failed:', response.data.message);
            }
        } catch (error) {
            console.error('Error during signup:', error);
        }
    };

    return (<div className="signup-container">

            <div className={"signup-logo"}>
                <img src={logo} alt="logo"/>
            </div>
            <div className="signup-form">
                <h1>Welcome - Dashboard</h1>
                <h2>Sign Up</h2>
                <form onSubmit={handleSignUp}>
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
                        <label htmlFor="email">Email: </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
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
                    <button type="submit" className={"btn btn-secondary"}>Sign Up</button>
                </form>
                <br/>
                <p>Already have an account? <Link to={"/login"}>Login</Link></p>
            </div>
        </div>

    );
}