const express = require('express');
const app = express();
const port = 3001;


// MIDDLEWARES
app.use(express.json());

// ROUTES
app.use('/auth', require('./router/auth'));

// START SERVER
app.listen(port, () => console.log(`Example app listening on port ${port}!`));