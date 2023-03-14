// IMPORT
const express = require("express");
const app = express();


// ROUTES
const routeOrder = require("./router/order");

// SERVER
app.use("/orders", routeOrder);

// Handler
const { errorhandler } = require("./handler/errorHandler");
app.use(errorhandler);


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = app;
