import {useEffect, useRef, useState} from "react";
import axiosInstance from "../api/axiosConfig.js";
import {io} from "socket.io-client";

export default function ChatRoom() {
    const [chats, setChats] = useState([]);
    const [activeChannel, setActiveChannel] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState("");
    const [roomName, setRoomName] = useState("");
    const [friendName, setFriendName] = useState("");
    const chatForm = useRef(null);
    const socketRef = useRef(null);
    const username = localStorage.getItem("username");

    // Initialize socket connection
    useEffect(() => {
        socketRef.current = io("http://localhost:3000", {
            transports: ["websocket"], reconnectionAttempts: 5, reconnectionDelay: 1000, reconnectionDelayMax: 5000,
        });

        socketRef.current.on("connect", () => {
            console.log("Connected to the server as " + username);
        });

        socketRef.current.on("message", (arg) => {
            const [sender, ...msgParts] = arg.split(": ");
            const msgText = msgParts.join(": ");
            setMessages((prev) => [...prev, arg]);
        });

        socketRef.current.on("newRoom", (room) => {
            loadChats().then();
        });

        return () => {
            socketRef.current.disconnect();
        };
        // eslint-disable-next-line
    }, []);

    // Fix chat loading
    async function loadChats() {
        const response = await axiosInstance.post("/chat/history", {username});
        const chatList = response?.data?.channels;
        if (response.data.success && Array.isArray(chatList)) {
            setChats(chatList);
            if (chatList.length > 0) {
                setActiveChannel(chatList[0].channel);
                setMessages(Array.isArray(chatList[0].messages) ? chatList[0].messages : []);
            } else {
                setActiveChannel(null);
                setMessages([]);
            }
        } else {
            setChats([]);
            setActiveChannel(null);
            setMessages([]);
        }
    }

    // Load chats on mount
    useEffect(() => {
        loadChats().then();
        // eslint-disable-next-line
    }, []);

    // Join the room when activeChannel changes
    useEffect(() => {
        if (activeChannel && socketRef.current) {
            socketRef.current.emit("joinRoom", activeChannel);
        }
    }, [activeChannel]);


    // Listen for messages on the active channel only
    useEffect(() => {
        if (!activeChannel || !socketRef.current) return;

        const handleMessage = (msg) => {
            setMessages((prev) => [...prev, msg]);
        };

        socketRef.current.on(activeChannel, handleMessage);

        return () => {
            socketRef.current.off(activeChannel, handleMessage);
        };
    }, [activeChannel]);

    function sendMessage(e) {
        e.preventDefault();
        if (messageInput.trim() && socketRef.current && socketRef.current.connected && activeChannel) {
            // Find the users array for the active channel
            const activeChat = chats.find((c) => c.channel === activeChannel);
            const users = activeChat?.users || [username];

            socketRef.current.emit("message", {
                channel: activeChannel, users, // include users array
                message: username + ": " + messageInput,
            });
            setMessageInput("");
        }
    }

    function createNewChat() {
        if (chatForm.current) {
            chatForm.current.style.display = "block";
        }
    }

    async function handleCreateChat(e) {
        e.preventDefault();
        if (roomName && friendName) {
            await axiosInstance.post("/chat/new", {
                username, friendName, roomName
            });
            setRoomName("");
            setFriendName("");
            if (chatForm.current) {
                chatForm.current.style.display = "none";
            }
            loadChats();
        }
    }

    function getOtherUser(chat) {
        return Array.isArray(chat.users) ? chat.users.find((n) => n !== username) || "Unknown" : "Unknown";
    }

    return (<div>
        <h1>Chat Room: {username}</h1>
        <div style={{display: "flex", flexDirection: "row"}}>
            <div className="chat-history" style={{minWidth: 200, padding: 10}}>
                {chats.map((chat) => (<button
                    key={chat.channel}
                    onClick={() => {
                        setActiveChannel(chat.channel);
                        setMessages(chat.messages);
                    }}
                    style={{
                        margin: "5px",
                        background: chat.channel === activeChannel ? "#d1e7dd" : "#f0f0f0",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        width: "100%",
                        textAlign: "left",
                    }}
                >
                    {getOtherUser(chat)} ({chat.channel})
                </button>))}
                <button
                    style={{
                        backgroundColor: "transparent", cursor: "pointer", border: "none", marginTop: "10px",
                    }}
                    onClick={createNewChat}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor"
                         className="bi bi-plus-square-fill" viewBox="0 0 16 16">
                        <path
                            d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0"/>
                    </svg>
                </button>
            </div>
            <div className="chat-portal" style={{flex: 1, position: "relative", padding: 10}}>
                {/* Create Chat Form */}
                <div
                    ref={chatForm}
                    style={{
                        display: "none",
                        position: "absolute",
                        background: "#fff",
                        padding: 20,
                        border: "1px solid #ccc",
                        zIndex: 10,
                        top: 20,
                        left: "50%",
                        transform: "translateX(-50%)",
                    }}
                >
                    <form onSubmit={handleCreateChat}>
                        <input
                            type="text"
                            placeholder="Chat Room Name"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            required
                            style={{marginBottom: 10, width: "100%"}}
                        />
                        <input
                            type="text"
                            placeholder="Friend's Username"
                            value={friendName}
                            onChange={(e) => setFriendName(e.target.value)}
                            required
                            style={{marginBottom: 10, width: "100%"}}
                        />
                        <div>
                            <button type="submit" style={{marginRight: 10}}>Create</button>
                            <button type="button" onClick={() => chatForm.current.style.display = "none"}>Cancel
                            </button>
                        </div>
                    </form>
                </div>
                {/* Chat Messages */}
                <div
                    className="chat-screen"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "stretch",
                        height: 400,
                        overflowY: "auto",
                        background: "#f5f5f5",
                        padding: 10,
                        marginBottom: 10,
                        borderRadius: 8,
                        border: "1px solid #eee",
                    }}
                >
                    {messages.map((msg, idx) => {
                        const [sender, ...msgParts] = msg.split(": ");
                        const isCurrentUser = sender === username;
                        return (<p
                            key={idx}
                            style={{
                                maxWidth: "60%",
                                padding: "8px 12px",
                                borderRadius: "16px",
                                margin: "8px",
                                wordBreak: "break-word",
                                background: isCurrentUser ? "#d1e7dd" : "#f8d7da",
                                color: "#222",
                                alignSelf: isCurrentUser ? "flex-end" : "flex-start",
                                textAlign: isCurrentUser ? "right" : "left",
                                display: "inline-block",
                            }}
                        >
                            {msg}
                        </p>);
                    })}
                </div>
                {/* Message Input */}
                <div className="message-form">
                    <form onSubmit={sendMessage} style={{display: "flex"}}>
                        <input
                            type="text"
                            className="message-input"
                            placeholder="Type your message..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            style={{
                                flex: 1, marginRight: 10, borderRadius: 8, border: "1px solid #ccc", padding: 8
                            }}
                        />
                        <button type="submit" style={{borderRadius: 8, padding: "8px 16px"}}>Send</button>
                    </form>
                </div>
            </div>
        </div>
    </div>);
}