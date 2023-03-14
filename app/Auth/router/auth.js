const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Validator
const {validateInsert, validateConnexion} = require('../validator/userValidator');

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
                "access-token": jwt.sign({id: user.id, username: user.nom_client, mail: user.mail_client}, process.env.JWT_SECRET, {expiresIn: '1h'})
            });
        }
    } catch (error) {
        console.log(error);
        next(500);
    }
});


router.post("/signin", validateConnexion, async (req, res, next) => {
    if(!req.body.email || !req.body.password) {
        return next(400);
    }
    try{
        const user = await User.getUser(req.body.email, req.body.password);
        if(!user) {
            return next(401);
        }else{
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({
                "access-token": jwt.sign({id: user.id, username: user.nom_client, mail: user.mail_client}, process.env.JWT_SECRET, {expiresIn: '1h'})
            });
        }
    }
    catch(err){
        console.log(err);
        next(500);
    }
});

router.get("/validate", async (req, res, next) => {
    const token = req.headers['bearer'];
    if(!token) {
        res.status(401).send({
            type: 'error',
            error: 401,
            message: 'Header not found'
        });
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).send({
            id: decoded.id
        });
    }catch(err){
        console.log(err);
        res.status(401).send({
            type: 'error',
            error: 401,
            message: 'Invalid token'
        });
    }
});


module.exports = router;