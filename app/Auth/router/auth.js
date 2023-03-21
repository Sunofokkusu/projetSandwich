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
        return next({code: 400, message: "Bad request"});
    }
    try {
        const user = await User.insertUser(req.body.email, req.body.username, req.body.password);
        if(!user) {
            return next(500);
        }else{
            res.setHeader('Content-Type', 'application/json');
            res.status(201).send({
                "access-token": jwt.sign({id: user.id, username: user.nom_client, mail: user.mail_client}, process.env.JWT_SECRET, {expiresIn: '1h'}),
                "refresh-token": user.refresh_token
            });
        }
    } catch (error) {
        next(error);
    }
});


router.post("/signin", validateConnexion, async (req, res, next) => {
    if(!req.body.email || !req.body.password) {
        return next({code: 400, message: "Bad request"});
    }
    try{
        const user = await User.getUser(req.body.email, req.body.password);
        if(!user) {
            return next({code: 401, message: "Unauthorized"});
        }else{
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({
                "access-token": "Bearer " + jwt.sign({id: user.id, username: user.nom_client, mail: user.mail_client}, process.env.JWT_SECRET, {expiresIn: '1h'}),
                "refresh-token": user.refresh_token
            });
        }
    }
    catch(err){
        next(err);
    }
});

router.post("/validate", async (req, res, next) => {
    const authorization = req.headers.authorization;
    if(!authorization) {
        next({code: 401, message: "Unauthorized"});
        return;
    }
    const token = authorization.split(' ')[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).send({
            id: decoded.id,
            email: decoded.email,
            username: decoded.username
        });
        return;
    }catch(err){
        next(err);
    }
});

router.all("*", (req, res, next) => {
    next({code : 405, message: "Method not allowed"});
});


module.exports = router;