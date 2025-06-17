const { client } = require("../models/mongo");
const express = require('express');


const router = express.Router();

router.post("/", async (req, res)=> {
    console.log("Update request received:", req.body);

    const {username, list} = req.body;
    if (!username || !Array.isArray(list)) {
        return res.status(400).json({success: false, message: "Username and list are required"});
    }

    try {
        await client.connect();
        const result = await client.db("todo").collection("todo_list").updateOne(
            {username},
            {$set: {list}},
            {upsert: true}
        );

        if (result.modifiedCount === 0 && result.upsertedCount === 0) {
            return res.status(400).json({success: false, message: "No changes made or user not found"});
        }

        console.log("Todo list updated for user:", username);

        res.status(200).json({
            success: true,
            message: "Todo list updated successfully"
        });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({success: false, message: "Update failed"});
    } finally {
        await client.close();
    }
});

module.exports = router;



