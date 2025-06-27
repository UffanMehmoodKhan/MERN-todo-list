import { Link } from "react-router-dom";
import "../../styles/components/footer.css";
import logo from "../../assets/img.png";

export default function Footer() {
    return (
        <footer className="footer-bar">
            <div className="footer-container">
                <div className="footer-section footer-logo">
                    <Link to="/">
                        <img className="logo" src={logo} alt="Logo" />
                    </Link>
                    <h6>Quality Resource Pvt. Ltd</h6>
                    <p>&copy; {new Date().getFullYear()}</p>
                </div>
                <div className="footer-section">
                    <h4>About</h4>
                    <p>Empowering your productivity with modern solutions.</p>
                </div>
                <div className="footer-section">
                    <h4>Links</h4>
                    <ul className="footer-list">
                        <li><Link to="/">Dashboard</Link></li>
                        <li><Link to="/todo">Todo</Link></li>
                        <li><Link to="/chat">Chat</Link></li>
                        <li><Link to="/">Contact</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Contact</h4>
                    <p>hello@qualityresource.com</p>
                    <div className="footer-socials">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <i className="fa-brands fa-twitter"></i>
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <i className="fa-brands fa-facebook"></i>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <i className="fa-brands fa-linkedin"></i>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}