const express = require('express');
const { ToDoController } = require('../controllers/ToDoController.js');


const router = express.Router();


// LOGIN ROUTE
router.post("/login", async (req, res, authMiddleware) => {
    await ToDoController.login(req, res);
});

// SIGNUP ROUTE
router.post("/register", async (req, res) => {
    await ToDoController.register(req, res);
});

router.delete('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'strict',
        secure: false // Set to true if using HTTPS
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// // DASHBOARD ROUTE
// router.post("/todo", async (req, res) => {
//     await ToDoController.todo(req, res);
// });
//
// router.post("/todo/update", async (req, res) => {
//     await ToDoController.update(req, res);
// });

module.exports = router;