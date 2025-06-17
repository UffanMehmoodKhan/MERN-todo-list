const express = require('express');
const cookieParser = require('cookie-parser');
const {verify} = require("jsonwebtoken");

const app = express();

app.use(cookieParser());

const authMiddleware = (req, res, next) => {
    console.log(req.cookies)
    const token = req.cookies && req.cookies.token;

    if (!token) {
        res.status(401).send({ message: 'Unauthorized Access' });
        return;
    }

    try {
        verify(token, process.env.JWT_SECRET);
        next();
    } catch (e) {
        res.status(401).send({ message: 'Invalid Token' });
    }
};

module.exports = { authMiddleware };
