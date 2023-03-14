const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Validator
const {validateInsert} = require('../validator/userValidator');

// Models
const User = require('../database/model/User');

// Routes
router.post("/signup", validateInsert ,async (req, res, next) => {
    if(!req.body.email || !req.body.password || !req.body.username) {
        return next(400);
    }
    try {
        const user = await User.insertUser(req.body.email, req.body.username, req.body.password);
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
        console.log(error);
        next(500);
    }
});

module.exports = router;