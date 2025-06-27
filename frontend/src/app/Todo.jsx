import {useEffect, useState, useMemo} from "react";
import {useNavigate, Link} from "react-router-dom";
import axiosInstance from "../api/axiosConfig.js";
import "../styles/todo.css";
import "../styles/app.css"

export default function ToDo() {
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

                const response = await axiosInstance.post('http://localhost:3000/todo', {username});
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
                username, list: items
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

    return (<>

        <div className="todo-container">
            <h1>TodoList</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="todo-list-container">
                <div className={"mb-4"} style={{display: "flex", justifyContent: "center", width: "100%", alignSelf: "center", color: "black", fontFamily: "Roboto, sans-serif"}}>
                    <h2>Welcome, {username}!</h2>
                </div>
                <div className="add-item-row">
                    <input
                        id={"add-item-input"}
                        type="text"
                        value={newItem}
                        onChange={e => setNewItem(e.target.value)}
                        placeholder="Add a new task..."
                        className="add-item-input"
                    />
                    <button className="add-item-btn" onClick={handleAdd}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor"
                             className="bi bi-plus-square-fill" viewBox="0 0 16 16">
                            <path
                                d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0"/>
                        </svg>
                    </button>
                </div>
                <ul className="todo-list-ui">
                    {items.map((item, idx) => (<li key={idx} className="todo-list-item">
                        <span>{item}</span>
                        <button className="remove-btn" onClick={() => handleRemove(idx)}>Remove</button>
                    </li>))}
                </ul>
                <div style={{display: "flex", justifyContent: "flex-end", width: "100%", alignSelf: "center"}}>
                    <button className="save-btn" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                </button></div>

            </div>


        </div>
    </>);
}