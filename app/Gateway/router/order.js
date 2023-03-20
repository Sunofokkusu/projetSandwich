const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/", async (req, res, next) => {
  try {
    let response = await axios.get(process.env.ORDER_ROUTES);
    res.json(response.data);
  } catch (error) {
    next(500);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    let response = await axios.get(
      process.env.ORDER_ROUTES + "/" + req.params.id
    );
    res.json(response.data);
  } catch (error) {
    next(500);
  }
});

router.get("/:id/items", async (req, res, next) => {
  try {
    let response = await axios.get(
      process.env.ORDER_ROUTES + "/" + req.params.id + "/items"
    );
    res.json(response.data);
  } catch (error) {
    next(500);
  }
});

router.put("/", async (req, res, next) => {
  try {
    let response = await axios.get(process.env.AUTH_ROUTES + "/validate", {
      headers: {
        Authorization: req.headers.authorization,
      },
    });
    response = await axios.put(process.env.ORDER_ROUTES, req.body);
    response = await axios.get(process.env.ORDER_ROUTES+response.data.link);
    res.json(response.data);
  } catch (error) {
    console.log(error);
    next(500);
  }
});

module.exports = router;
