const express = require('express');
const app = express();
const PORT = 3000;
const axios  = require('axios');

app.use(express.json());

app.use("/auth" , require('./router/auth'));
app.use("/orders", require('./router/order'));
app.use("/sandwiches", require('./router/sandwiches'));

// Handler
const { errorhandler } = require("./handler/errorHandler");
app.use(errorhandler);

app.listen(PORT, () => {
    console.log(`Gateway listening on port ${PORT}`);
});