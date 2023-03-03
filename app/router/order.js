const express = require("express");
const fs = require("fs");
const router = express.Router();

router.use(express.json());

// Model
const order = require("../database/model/order");
const item = require("../database/model/items");

// Validator
const {
  validateUpdate,
  validateInsert,
} = require("../validator/orderValidator");

// Helper 
const { generateIdCommande } = require("../helper/GenerateIdCommande");

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      let orders = await order.getOrders();
      if (orders.length === 0) {
        res.setHeader("Content-Type", "application/json");
        res.status(404).send({
          type: "error",
          error: 404,
          message: "Ressources non disponible : /orders",
        });
      } else {
        let orderFromDb = [];
        orders.forEach((order) => {
          orderFromDb.push({
            id: order.id,
            client_mail: order.mail,
            order_date: order.created_at,
            total_amount: order.montant,
          });
        });
        res.setHeader("Content-Type", "application/json");
        res.status(200).send({
          type: "collection",
          count: orders.length,
          orders: orderFromDb,
        });
      }
    } catch (err) {
      next(500);
    }
  })
  .put(validateInsert, async (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    try {
      let amount = 0;
      if(req.body.items != undefined) {
        req.body.items.forEach((item) => {
          amount += item.price * item.q;
        });
      }
      let id = generateIdCommande();
      let isInsert = await order.insertOrder(
        id,
        req.body.client_name,
        req.body.client_mail,
        req.body.delivery,
        amount
      );
      if ( !isInsert ) {
        res.status(400).send({
          type: "error",
          error: 400,
          message: "Ressource non créée : /orders",
        });
      } else {
        if(req.body.items != undefined) {
          isInsert = await item.insertItems(id, req.body.items);
          if ( !isInsert ) {
            res.status(400).send({
              type: "error",
              error: 400,
              message: "Items non ajoutés : /orders/" + id,
            });
          } else {
            res.status(204).redirect("/orders/" + id + "?embed=items");
          }
        }else{
          res.status(204).redirect("/orders/" + id);
        }
      }
    } catch (err) {
      next(500);
    }
  })
  .all((req, res, next) => {
    next(405);
  });

router
  .route("/:id")
  .get((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    try {
      order.getOrderById(req.params.id).then(async (orders) => {
        if (orders.length === 0) {
          res.status(404).send({
            type: "error",
            error: 404,
            message: "Ressources non disponible : /orders/" + req.params.id,
          });
        } else {
          let query = req.query;
          let json = "";
          if (query.embed !== undefined && query.embed === "items") {
            let itemsFromId = await order.getItemsFromOrder(req.params.id);
            let items = [];
            itemsFromId.forEach((item) => {
              items.push({
                id: item.id,
                uri: item.uri,
                name: item.libelle,
                price: item.tarif,
                quantity: item.quantite,
              });
            });
            json = {
              type: "resource",
              order: {
                id: orders[0].id,
                client_mail: orders[0].mail,
                order_date: orders[0].created_at,
                total_amount: orders[0].montant,
              },
              items: items,
              links: {
                items: { href: "/orders/" + orders[0].id + "/items" },
                self: { href: "/orders/" + orders[0].id },
              },
            };
          } else {
            json = {
              type: "resource",
              order: {
                id: orders[0].id,
                client_mail: orders[0].mail,
                order_date: orders[0].created_at,
                total_amount: orders[0].montant,
              },
              links: {
                items: { href: "/orders/" + orders[0].id + "/items" },
                self: { href: "/orders/" + orders[0].id },
              },
            };
          }
          res.status(200).send(json);
        }
      });
    } catch (err) {
      next(500);
    }
  })
  .patch(validateUpdate, async (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    try {
      let isUpdate = await order.updateOrder(
        req.params.id,
        req.body.nom,
        req.body.livraison,
        req.body.mail
      );
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

router
  .route("/:id/items")
  .get((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    try {
      order.getItemsFromOrder(req.params.id).then((order) => {
        if (order.length === 0) {
          res.status(404).send({
            type: "error",
            error: 404,
            message:
              "Ressources non disponible : /orders/" + req.params.id + "/item",
          });
        } else {
          let items = [];
          order.forEach((item) => {
            items.push({
              id: item.id,
              uri: item.uri,
              name: item.libelle,
              price: item.tarif,
              quantity: item.quantite,
            });
          });
          res.setHeader("Content-Type", "application/json");
          res.status(200).send({
            type: "collection",
            count: items.length,
            items: items,
          });
        }
      });
    } catch (err) {
      next(500);
    }
  })
  .all((req, res, next) => {
    next(405);
  });

module.exports = router;
