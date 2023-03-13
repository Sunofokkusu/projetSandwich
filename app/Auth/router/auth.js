const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Models
const User = require('../database/models/user');

// Routes
router.post("/signup", async (req, res, next) => {
    if(!req.body.email || !req.body.password || !req.body.username) {
        return next(400);
    }
    try {
        const user = await User.create(req.body.email, req.body.username, req.body.password);
        if(!user) {
            return next(500);
        }else{
            res.setHeader('Content-Type', 'application/json');
            res.status(201).send({
                "type": "success",
                "token": jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '1h'})
            });
        }
    } catch (error) {
        next(500);
    }
});