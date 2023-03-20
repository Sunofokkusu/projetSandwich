const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res, next) => {
    try {
        let response = await axios.get(process.env.ORDER_ROUTES)
        res.json(response.data);
    } catch (error) {
        next(500);
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        let response = await axios.get(process.env.ORDER_ROUTES + '/' + req.params.id)
        res.json(response.data);
    } catch (error) {
        next(500);
    }
})

router.router.get('/:id/items', async (req, res, next) => {
    try {
        let response = await axios.get(process.env.ORDER_ROUTES + '/' + req.params.id + '/items')
        res.json(response.data);
    } catch (error) {
        next(500);
    }
})

router.put('/', async (req, res, next) => {
    try {
        let response = await axios.put(process.env.AUTH_ROUTES + '/validate', req.body, {
            headers: {
                'Authorization': req.headers.authorization
            }
        })
        let json = response.data;
        if (json.status === 200) {
            let response = await axios.post(process.env.ORDER_ROUTES, req.body)
            res.json(response.data);
        } else {
            res.json(json);
        }
    } catch (error) {
        next(500);
    }
})

module.exports = router;
