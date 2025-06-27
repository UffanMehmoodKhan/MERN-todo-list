const express = require('express');
const {messageController} = require('../controllers/messageController');



const router = express.Router();

router.post("/chat/history", async (req, res) => {
    await messageController.getMessages(req, res);
})

router.post("/chat/new", async (req, res) => {
    await messageController.createChannel(req, res);
});

module.exports = router;