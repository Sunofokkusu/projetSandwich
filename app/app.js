// IMPORT
const express = require("express");
const app = express();

// CONST
const PORT = 3000;

// ROUTES
const routeOrder = require("./router/order");

// SERVER
app.use("/orders", routeOrder);

// Handler
const { errorhandler } = require("./handler/errorHandler");
app.use(errorhandler);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
