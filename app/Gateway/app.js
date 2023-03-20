const express = require('express');
const app = express();
const PORT = 3000;
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

app.put('/orders', async (req, res) => {
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

app.use("/auth" , require('./router/auth'));
app.use("/orders", require('./router/order'));
app.use("/sandwiches", require('./router/sandwiches'));


app.listen(PORT, () => {
    console.log(`Gateway listening on port ${PORT}`);
});