const express = require('express');
const app = express();
const PORT = 3000;
const { createProxyMiddleware } = require('http-proxy-middleware');
const axios  = require('axios');

app.use(express.json());

app.get('/orders', async (req, res) => {
    let response = await axios.get(process.env.ORDER_ROUTES)
    res.json(response.data);
})

app.post('/auth/signup', async (req, res) => {
    let response = await axios.post(process.env.AUTH_ROUTES + '/signup', req.body)
    res.json(response.data);
})

app.listen(PORT, () => {
    console.log(`Gateway listening on port ${PORT}`);
});