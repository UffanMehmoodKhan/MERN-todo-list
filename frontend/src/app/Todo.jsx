import {useEffect, useState, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import axiosInstance from "../api/axiosConfig.js";
import {Link} from "react-router-dom";
import "../styles/app.css";

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
        <div className="dashboard-container">
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
                    {items.map((item, idx) => (<li key={idx} className="todo-list-item">
                        <span>{item}</span>
                        <button className="remove-btn" onClick={() => handleRemove(idx)}>Remove</button>
                    </li>))}
                </ul>
                <button className="save-btn" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                </button>
            </div>


        </div>
    </>);
}