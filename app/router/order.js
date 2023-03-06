const express = require("express");
const fs = require("fs");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

router.use(express.json());

// Model
const order = require("../database/model/order");
const item = require("../database/model/items");

// Const 

__filename = "order.js";

// Validator
const {
  validateUpdate,
  validateInsert,
} = require("../validator/orderValidator");

// Helpers
const { createDetails, createDetailsPerso } = require("../helpers/errorDetails");

// Handler
const { infoHandler } = require("../handler/infoHandler");

router
  .route("/")
  .get(async (req, res, next) => {
    try {
      let orders = await order.getOrders();
      if (orders.length === 0) {
        next(createDetailsPerso(404, { message: "Ressource non trouvée /orders" , file: __filename, line: 31}));
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
      next(createDetails(500, err));
    }
  })
  .put(validateInsert, async (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    try {
      let amount = 0;
      if (req.body.items != undefined) {
        req.body.items.forEach((item) => {
          amount += item.price * item.q;
        });
      }
      let id = uuidv4();
      let isInsert = await order.insertOrder(
        id,
        req.body.client_name,
        req.body.client_mail,
        req.body.delivery,
        amount
      );
      if (!isInsert) {
        next(createDetailsPerso(400, { message: "Commande non ajoutée : /orders", file: __filename, line: 71}));
      } else {
        if (req.body.items != undefined) {
          isInsert = await item.insertItems(id, req.body.items);
          if (!isInsert) {
            next(createDetailsPerso(400, { message: "Commande non ajoutée : /orders", file: __filename, line: 76}));
          } else {
            infoHandler({status : 201, message : "Commande ajoutée : /orders/" + id + "?embed=items"}, req)
            res.status(301).redirect("/orders/" + id + "?embed=items");
          }
        } else {
          infoHandler({status : 201, message : "Commande ajoutée : /orders/" + id}, req)
          res.status(301).redirect("/orders/" + id);
        }
      }
    } catch (err) {
      next(createDetails(500, err));
    }
  })
  .all((req, res, next) => {
    next(createDetailsPerso(405, { message: "Méthode non autorisée : /orders : " + req.method, file: __filename, line: 89}));
  });

router
  .route("/:id")
  .get(async (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    try {
      let orders = await order.getOrderById(req.params.id);
      if (orders.length === 0) {
        next(createDetailsPerso(404, { message: "Ressource non trouvée : /orders/" + req.params.id, file: __filename, line: 99}));
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
    } catch (err) {
      next(createDetails(500, err));
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
        next(createDetailsPerso(404, { message: "Commande non modifiée : /orders/" + req.params.id, file: __filename, line: 160}));
      } else {
        infoHandler({status : 204, message : "Commande modifiée : /orders/" + req.params.id}, req)
        res.status(204).send();
      }
    } catch (err) {
      next(createDetails(500, err));
    }
  })
  .all((req, res, next) => {
    next(createDetailsPerso(405, { message: "Méthode non autorisée : /orders : " + req.method, file: __filename, line: 169}));
  });

router
  .route("/:id/items")
  .get(async (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    try {
      let orders = await order.getItemsFromOrder(req.params.id);
      if (orders.length === 0) {
        res.status(404).send({
          type: "error",
          error: 404,
          message:
            "Ressources non disponible : /orders/" + req.params.id + "/item",
        });
      } else {
        let items = [];
        orders.forEach((item) => {
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
    } catch (err) {
      next(createDetails(500, err));
    }
  })
  .all((req, res, next) => {
    next(createDetailsPerso(405, { message: "Méthode non autorisée : /orders : " + req.method, file: __filename, line: 208}));
  });

module.exports = router;
