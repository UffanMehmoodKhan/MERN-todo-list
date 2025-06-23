import {useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function ChatRoom() {
    const socketRef = useRef(null);
    const socket = io("http://localhost:3000", {
        transports: ['websocket'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
    });


    const username = localStorage.getItem('username')



    socket.on("connect", () => {
        console.log("Connected to the server as " + username);
    });

    function displayMessage(arg) {
        const screen = document.querySelector(".screen");
        if (screen) {
            const messageElement = document.createElement("p");
            messageElement.textContent = arg;
            screen.appendChild(messageElement);
        } else {
            console.error("Screen element not found");
        }

    }

    socket.on("message", (arg) => {
        console.log(username + ": " + arg); // world
        displayMessage(arg);
    });

    // Emit a message to the server
    function sendMessage(message) {
        if (socket && socket.connected) {
            socket.emit("message", username + ": " + message);

        } else {
            console.error("Socket is not connected");
        }
    }

    // Clean up the socket connection when the component unmounts
    useEffect(() => {
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);



    return (
        <div>
            <h1>Chat Room</h1>
            <div className={"chat-portal"}>
                <div className={"screen"} style={{backgroundColour: 'red', width: '700px', height: '500px', overflowY: 'scroll'}}>

                </div>
                <div className={"message-form"}>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const messageInput = document.getElementById("message-input");
                        const message = messageInput.value.trim();
                        if (message) {
                            sendMessage(message);
                            messageInput.value = ""; // Clear the input after sending
                        }
                    }}>

                        <input
                            id={"message-input"}
                            type={"text"}
                            className={"message-input"}
                            placeholder={"Type your message..."}

                        />
                        <button type={"submit"}>Send</button>
                    </form>

                </div>
            </div>
        </div>
    );
}