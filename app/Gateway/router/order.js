const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
    let response = await axios.get(process.env.ORDER_ROUTES)
    res.json(response.data);
})

router.get('/:id', async (req, res) => {
    let response = await axios.get(process.env.ORDER_ROUTES + '/' + req.params.id)
    res.json(response.data);
})

router.put('/', async (req, res) => {
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
