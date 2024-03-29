const express = require('express');
const router = express.Router();
const axios = require('axios');


router.post('/signup', async (req, res, next) => {
    try{
        let response = await axios.post(process.env.AUTH_ROUTES + '/signup', req.body)
        res.json(response.data);
    }catch (error){
        next(error.response.data)
    }
})

router.post('/signin', async (req, res, next) => {
    try{
        let response = await axios.post(process.env.AUTH_ROUTES + '/signin', req.body)
        res.json(response.data);
    }catch (error){
        next(error.response.data)
    }
})

module.exports = router;

