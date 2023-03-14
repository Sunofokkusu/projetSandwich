const express = require('express');
const app = express();
const PORT = 3000;
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios  = require('axios');

app.get('/orders', async (req, res) => {
    let response = await axios.get(process.env.ORDER_ROUTES)
    res.json(response.data);
})

app.get('/auth/signup', async (req, res) => {
    let response = await axios.get(process.env.AUTH_ROUTES + '/signup')
    res.json(response.data);
})

app.listen(PORT, () => {
    console.log(`Gateway listening on port ${PORT}`);
});