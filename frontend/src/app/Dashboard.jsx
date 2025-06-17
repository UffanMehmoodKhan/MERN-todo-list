import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosConfig.js";
import "../styles/app.css";

export default function Dashboard() {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [newItem, setNewItem] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!username) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const response = await axiosInstance.post('http://localhost:3000/todo', { username });
                const dataArray = response?.data?.list;
                if (response.data.success && Array.isArray(dataArray)) {
                    setItems(dataArray);
                    setError(null);
                } else {
                    setItems([]);
                    setError('No data received or data format incorrect.');
                }
            } catch (err) {
                setItems([]);
                setError('An error occurred while fetching data.');
            }
        };

        fetchData();
    }, [username, navigate]);

    const handleRemove = (idx) => {
        setItems(items => items.filter((_, i) => i !== idx));
    };

    const handleAdd = () => {
        if (newItem.trim()) {
            setItems(items => [...items, newItem.trim()]);
            setNewItem('');
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await axiosInstance.post('http://localhost:3000/todo/update', {
                username,
                list: items
            });
            if (response.data.success) {
                setError(null);
            } else {
                setError('Failed to save changes.');
            }
        } catch (error) {
            setError('An error occurred while saving.');
        }
        setSaving(false);
    };

    const handleSignOut = async () => {

        try {
            await axiosInstance.delete('http://localhost:3000/logout', { withCredentials: true });
            localStorage.clear();
        } catch (error) {
            console.error('Logout failed:', error);
        }
        navigate("/");
    };

    return (
        <>
            <nav className="nav-bar">
                <span style={{ fontWeight: 700, fontSize: "1.2em" }}>Dashboard</span>
                <button className="signout-btn" onClick={handleSignOut}>Sign Out</button>
            </nav>
            <div className="dashboard-container">
                <h2>Dashboard</h2>
                <p>Welcome, {username}!</p>
                {error && <p className="error-message">{error}</p>}
                <div className="todo-list-container">
                    <div className="add-item-row">
                        <input
                            type="text"
                            value={newItem}
                            onChange={e => setNewItem(e.target.value)}
                            placeholder="Add a new task..."
                            className="add-item-input"
                        />
                        <button className="add-item-btn" onClick={handleAdd}>Add</button>
                    </div>
                    <ul className="todo-list-ui">
                        {items.map((item, idx) => (
                            <li key={idx} className="todo-list-item">
                                <span>{item}</span>
                                <button className="remove-btn" onClick={() => handleRemove(idx)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                    <button className="save-btn" onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </>
    );
}