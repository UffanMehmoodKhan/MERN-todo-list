const express = require('express');
const { ToDoController } = require('../controllers/ToDoController.js');


const router = express.Router();


// LOGIN ROUTE
router.post("/login", async (req, res) => {
    await ToDoController.login(req, res);
});

// SIGNUP ROUTE
router.post("/register", async (req, res) => {
    await ToDoController.register(req, res);
});

// DASHBOARD ROUTE
router.post("/todo", async (req, res) => {
    await ToDoController.todo(req, res);
});

router.post("/todo/update", async (req, res) => {
    await ToDoController.update(req, res);
});

module.exports = router;