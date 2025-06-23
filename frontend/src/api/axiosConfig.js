// src/api/axiosConfig.js
import axios from 'axios';
import { io } from "socket.io-client";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Create a Socket.IO connection
// const io = new Server({
//     cors: {
//         origin: "http://localhost:3000"
//     }
// });
//
// io.listen(4000);



export default axiosInstance;