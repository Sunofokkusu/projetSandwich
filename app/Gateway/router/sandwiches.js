const express = require('express');
const router = express.Router();
const axios = require('axios');


router.get('/', async (req, res) => {
    let response = await axios.get(process.env.SANDWICHES_ROUTES+ "?fields=*.*")
    res.json(response.data);
})

router.get('/:id', async (req, res) => {
    let response = await axios.get(process.env.SANDWICHES_ROUTES + "?fields=*.*&filter=id,eq," + req.params.id)
    res.json(response.data);
})

module.exports = router;
