const express = require("express");
const fs = require("fs");
const router = express.Router();

router.use(express.json());

// Model
const order = require("../database/model/order");

// Validator
const {validateUpdate} = require("../validator/orderValidator");

router.route("/")
  .get(async (req, res, next) => {
    try {
        let orders = await order.getOrders();	
        if( orders.length === 0 ) {
            res.setHeader('Content-Type', 'application/json');
            res.status(404).send({
                type: 'error',
                error: 404,
                message: 'Ressources non disponible : /orders'
            });
        }else {
            let orderFromDb = [];
            orders.forEach((order) => {
                orderFromDb.push({
                    id: order.id,
                    client_mail: order.mail,
                    order_date: order.created_at,
                    total_amount: order.montant
                });
            });
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send({
                type: 'collection',
                count: orders.length,
                orders: orderFromDb
            });
        }
    } catch (err) {
        next(500);
    }
  })
  .all((req, res,next) => {
    next(405);
  });

router.route("/:id")
  .get((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    try {
      order.getOrderById(req.params.id).then((order) => {
        if (order.length === 0) {
          res.status(404).send({
            type: "error",
            error: 404,
            message: "Ressources non disponible : /orders/" + req.params.id,
          });
        } else {
          res.status(200).send({
            type: "resource",
            order: {
              id: order[0].id,
              client_mail: order[0].mail,
              order_date: order[0].created_at,
              total_amount: order[0].montant,
            },
          });
        }
      });
    } catch (err) {
      next(500);
    }
  })
  .put(validateUpdate, async (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    try {
      let isUpdate = await order.updateOrder(req.params.id, req.body.nom, req.body.livraison, req.body.mail);
      if (isUpdate === 0) {
        res.status(404).send({
          type: "error",
          error: 404,
          message: "Ressources non disponible : /orders/" + req.params.id,
        });
      } else {
        res.status(204).send();
      }
    } catch (err) {
      next(500);
    }
  })
  .all((req, res, next) => {
    next(405);
  });

module.exports = router;
