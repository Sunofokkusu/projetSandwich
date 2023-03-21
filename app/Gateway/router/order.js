const express = require("express");
const router = express.Router();
const axios = require("axios");

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      let response;
      if (req.query.page !== undefined) {
        response = await axios.get(
          process.env.ORDER_ROUTES + "?page=" + req.query.page
        );
      } else {
        response = await axios.get(process.env.ORDER_ROUTES);
      }
      res.json(response.data);
    } catch (error) {
      next(error.response.data);
    }
  })
  .post(async (req, res, next) => {
    try {
      let response = await axios.post(process.env.AUTH_ROUTES + "/validate", {
        headers: {
          Authorization: req.headers.authorization,
        },
      });
      response = await axios.put(process.env.ORDER_ROUTES, req.body);
      response = await axios.get(process.env.ORDER_ROUTES + response.data.link);
      res.json(response.data);
    } catch (error) {
      next(error.response.data);
    }
  }).all((req, res, next) => {
    next(405);
  });

router.get("/:id", async (req, res, next) => {
  try {
    let response = "";
    if (req.query.embed !== undefined) {
      response = await axios.get(
        process.env.ORDER_ROUTES + "/" + req.params.id + "?embed=items"
      );
    } else {
      response = await axios.get(
        process.env.ORDER_ROUTES + "/" + req.params.id
      );
    }
    res.json(response.data);
  } catch (error) {
    next(error.response.data);
  }
});

router.get("/:id/items", async (req, res, next) => {
  try {
    let response = await axios.get(
      process.env.ORDER_ROUTES + "/" + req.params.id + "/items"
    );
    res.json(response.data);
  } catch (error) {
    next(error.response.data);
  }
});

module.exports = router;
