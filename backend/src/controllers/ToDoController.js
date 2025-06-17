const {client} = require('../models/mongo');
const bcrypt = require('bcrypt');
const {saltRound, generateToken} = require("../middlewares/common");

class ToDoController {
    /**
     * Handles user login by validating credentials and returning the user's todo list.
     * @param {Object} req - The request object containing user credentials.
     * @param {Object} res - The response object to send the result.
     */
    static async login(req, res) {
        console.log("Login request received:", req.body);
        const {username, password} = req.body;

        if (!username || !password) {
            return res.status(400).json({success: false, message: "Username and password are required"});
        }

        try {
            await client.connect();
            const user = await client.db("todo").collection("users").findOne({username});
            console.log("User found:", user);

            if (!user) {
                return res.status(401).json({success: false, message: "Invalid username or password"});
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log("Password validation result:", isPasswordValid);

            if (!isPasswordValid) {
                return res.status(401).send({
                    success: false,
                    message: 'Invalid password',
                    password: false,
                });
            }

            // Fetch the user's todo list
            const todoDoc = await client.db("todo").collection("todo_list").findOne({username});
            const list = todoDoc && Array.isArray(todoDoc.list) ? todoDoc.list : [];

            console.log("User found:", user);
            console.log("Todo list retrieved:", list);


            // Generate a token for the user
            const token = generateToken(user);

            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 3600000,
                sameSite: 'strict', // Adjust as needed
                secure: false, // Set to true if using HTTPS
            })
                .status(200)
                .json({
                    success: true,
                    message: "Login successful",
                    token,
                    list
                });

        } catch (error) {
            console.error("Login error:", error);
            res.status(500).json({success: false, message: "Login failed"});
        } finally {
            await client.close();
        }
    }

    static async register(req, res) {
        console.log("SignUp request received:", req.body);
        const {username, email, password} = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({success: false, message: "Username, email, and password are required"});
        }

        try {
            await client.connect();
            const db = client.db("todo");
            const existingUser = await db.collection("users").findOne({
                $or: [{username}, {email}]
            });

            if (existingUser) {
                return res.status(409).json({success: false, message: "Username or email already exists"});
            }

            const hashedPassword = await bcrypt.hash(password, saltRound);

            await db.collection("users").insertOne({username, email, password: hashedPassword});
            res.status(201).json({success: true, message: "Registration successful"});
        } catch (error) {
            console.error("Registration error:", error);
            res.status(500).json({success: false, message: "Registration failed"});
        } finally {
            await client.close();
        }
    }

    // static async todo(req, res) {
    //     try {
    //
    //         const username = req.body.username || req.query.username || req.headers['username'];
    //         await client.connect();
    //
    //         // Fetch the users todo list
    //         const todoDoc = await client.db("todo").collection("todo_list").findOne({username});
    //         const list = todoDoc && Array.isArray(todoDoc.list) ? todoDoc.list : [];
    //
    //         console.log("Todo list retrieved for user:", username, list);
    //
    //         res.status(200).json({
    //             success: true,
    //             list
    //         });
    //     } catch (error) {
    //         console.error("Login error:", error);
    //         res.status(500).json({success: false, message: "Login failed"});
    //     } finally {
    //         await client.close();
    //     }
    // }

    // static async update(req, res) {
    //
    //     console.log("Update request received:", req.body);
    //
    //     const {username, list} = req.body;
    //     if (!username || !Array.isArray(list)) {
    //         return res.status(400).json({success: false, message: "Username and list are required"});
    //     }
    //
    //     try {
    //         await client.connect();
    //         const result = await client.db("todo").collection("todo_list").updateOne(
    //             {username},
    //             {$set: {list}},
    //             {upsert: true}
    //         );
    //
    //         if (result.modifiedCount === 0 && result.upsertedCount === 0) {
    //             return res.status(400).json({success: false, message: "No changes made or user not found"});
    //         }
    //
    //         console.log("Todo list updated for user:", username);
    //
    //         res.status(200).json({
    //             success: true,
    //             message: "Todo list updated successfully"
    //         });
    //     } catch (error) {
    //         console.error("Update error:", error);
    //         res.status(500).json({success: false, message: "Update failed"});
    //     } finally {
    //         await client.close();
    //     }
    // }
}

module.exports = {ToDoController};