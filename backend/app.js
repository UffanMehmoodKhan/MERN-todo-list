const express = require('express');
const app = express();
const dotenv = require('dotenv');

const path = require('path');
const cors = require('cors');
const { run } = require('./src/models/mongo');
const userRouter = require('./src/routes/user.js');
const todoRouter = require('./src/routes/todo');
const updateRouter = require('./src/routes/update');
const {authMiddleware} = require("./src/middlewares/authMiddleware");
const cookieParser = require('cookie-parser');

// Load environment variables from .env file
dotenv.config();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    })
);
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.use('/', userRouter);
app.use('/todo', authMiddleware, todoRouter);
app.use('/todo/update', authMiddleware, updateRouter);



// Route to handle the root path
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the To-Do List App</h1><p>Use the navigation links to access different features.</p>');
});

run().catch(console.dir);


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});