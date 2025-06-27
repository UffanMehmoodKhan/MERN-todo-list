const express = require('express');
const {createServer} = require('http');
const {Server} = require('socket.io');
const {client} = require('./src/models/mongo');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "wss://localhost:5173",
        allowedHeaders: ['Content-Type'],
        credentials: true
    }
});
module.exports.io = io;


const dotenv = require('dotenv');
const path = require('path');

const cors = require('cors');
const {run} = require('./src/models/mongo');
const {authMiddleware} = require("./src/middlewares/authMiddleware");
const cookieParser = require('cookie-parser');

const userRouter = require('./src/routes/user.js');
const todoRouter = require('./src/routes/todo');
const updateRouter = require('./src/routes/update');
const chatRouter = require('./src/routes/chat');

// Load environment variables from .env file
dotenv.config();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true,
}));
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.use('/', userRouter);
app.use('/todo', authMiddleware, todoRouter);
app.use('/todo/update', authMiddleware, updateRouter);
app.use('/', chatRouter);


// Route to handle the root path
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the To-Do List App</h1><p>Use the navigation links to access different features.</p>');
});

run().catch(console.dir);

// Socket.IO connection
// io.on("connection", (socket) => {
//     socket.emit("message", "Client Connected");
// });


io.on("connection", (socket) => {
    socket.on("joinRoom", (room) => {
        socket.join(room);
    });

    socket.on("message", async ({ channel, users, message }) => {
        if (!Array.isArray(users) || !channel || !message) {
            console.error("Invalid message payload:", { channel, users, message });
            return;
        }
        try {
            await client.connect();
            await client
                .db("todo")
                .collection("messages")
                .updateOne(
                    { channel: channel, users: { $all: users, $size: users.length } },
                    { $push: { messages: message } }
                );
            io.to(channel).emit(channel, message);
        } catch (err) {
            console.error("Failed to save message:", err);
        }
    });
});

// Start the HTTP server
httpServer.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
})