const express = require('express');
const router = express.Router();
const axios = require('axios');

app.use(express.json());

app.get('/', async (req, res) => {
    let response = await axios.get(process.env.ORDER_ROUTES)
    res.json(response.data);
})

app.get('/:id', async (req, res) => {
    let response = await axios.get(process.env.ORDER_ROUTES+req.id)
    res.json(response.data);
})

app.put('/', async (req, res) => {
    let response = await axios.put(process.env.AUTH_ROUTES + '/validate', req.body, {
        headers: {
            'Authorization': req.headers.authorization
        }
    })
    let json = response.data;
    if(json.status === 200) {
        let response = await axios.post(process.env.ORDER_ROUTES, req.body)
        res.json(response.data);
    }else{
        res.json(json);
    }
})

module.exports = router;
