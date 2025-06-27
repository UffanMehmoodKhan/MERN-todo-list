const {client} = require('../models/mongo');
const {io} = require('../../app');

class messageController {

    static async createChannel(req, res) {
        const { username, friendName, roomName } = req.body;
        if (!username || !friendName || !roomName) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        try {
            await client.connect();
            const collection = client.db("todo").collection("messages");
            // Check if channel already exists
            const exists = await collection.findOne({ channel: roomName });
            if (exists) {
                return res.status(409).json({ success: false, message: "Channel already exists" });
            }
            await collection.insertOne({
                channel: roomName,
                users: [username, friendName],
                messages: []
            });
            res.status(201).json({ success: true, message: "Channel created" });
        } catch (error) {
            res.status(500).json({ success: false, message: "Failed to create channel" });
        }
    }

    // src/controllers/messageController.js
    static async getMessages(req, res) {
        const username = req.body.username;
        console.log(username)
        if (!username) {
            return res.status(400).json({ success: false, message: "Username is required" });
        }
        try {
            await client.connect();
            const channels = await client
                .db("todo")
                .collection("messages")
                .find({ users: username })
                .project({ channel: 1, messages: 1, users: 1, _id: 0 })
                .toArray();
            if (!channels || channels.length === 0) {
                return res.status(404).json({ success: false, message: "No messages found for this user" });
            }

            console.log(channels)
            res.status(200).json({
                success: true,
                channels
            });
        } catch (error) {
            res.status(500).json({ success: false, message: "Failed to fetch messages" });
        }
    }

    async saveMessages(req, res) {

    }
}

module.exports = {messageController};