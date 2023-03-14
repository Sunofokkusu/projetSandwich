const express = require('express');
const app = express();



// MIDDLEWARES
app.use(express.json());

// ROUTES
app.use('/auth', require('./router/auth'));

// START SERVER
app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));