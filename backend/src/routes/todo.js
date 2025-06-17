const { client } = require("../models/mongo");
const express = require('express');

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const username = req.body.username || req.query.username || req.headers['username'];
        await client.connect();

        // Fetch the user's todo list
        const todoDoc = await client.db("todo").collection("todo_list").findOne({ username });
        const list = todoDoc && Array.isArray(todoDoc.list) ? todoDoc.list : [];

        console.log("Todo list retrieved for user:", username, list);

        res.status(200).json({
            success: true,
            list
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Login failed" });
    } finally {
        await client.close();
    }
});

module.exports = router;