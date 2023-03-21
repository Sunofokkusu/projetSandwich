const express = require('express');
const router = express.Router();
const axios = require('axios');


router.get('/', async (req, res, next) => {
    try{
        let response = await axios.get(process.env.SANDWICHES_ROUTES+ "?fields=*.*")
        res.json(response.data);
    }catch(err){
        next(err.response.data);
    }
})

router.get('/:id', async (req, res, next) => {
    try{
        let response = await axios.get(process.env.SANDWICHES_ROUTES + "?fields=*.*&filter[id]=" + req.params.id)
        res.json(response.data);
    }catch(err){
        next(err.response.data);
    }
})

module.exports = router;
