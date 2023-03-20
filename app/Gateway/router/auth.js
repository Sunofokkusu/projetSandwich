const express = require('express');
const router = express.Router();
const axios = require('axios');


app.post('/signup', async (req, res) => {
    let response = await axios.post(process.env.AUTH_ROUTES + '/signup', req.body)
    res.json(response.data);
})

app.post('/signin', async (req, res) => {
    let response = await axios.post(process.env.AUTH_ROUTES + '/signin', req.body)
    res.json(response.data);
})

module.exports = router;

