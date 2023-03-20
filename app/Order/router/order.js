const express = require("express");
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
      if (orders.length === 0 || orders === undefined) {
        next(createDetailsPerso(404, { message: "Ressource non trouvée /orders" , file: __filename, line: 31}));
      } else {
        let length = orders.length;
        let query = req.query
        if (query.c != undefined) {
          let mail = decodeURI(query.c)
          orders = orders.filter(order => mail === order.mail)
        }
        if (query.sort != undefined) {
          switch (query.sort) {
            case "created": orders = orders.sort((a,b) => b.created_at-a.created_at)
              break
            case "delivery": orders = orders.sort((a,b) => b.livraison-a.livraison)
              break
            case "amount": orders = orders.sort((a,b) => b.montant-a.montant)
              break
          }
        }
        let page = 1
        let tmp = []
        if (query.page != undefined) {
          page = query.page
        }
        let stop = false
        let i = (page-1) > 0 ? ((parseInt(page)-1)*10) : 0
        let max = i+10
        console.log(i, max-1)
        while(!stop || i<(max-1)) { 
          if (orders[i] === undefined) {
            stop = true
          } else {
            tmp.push(orders[i])
          }
          i++
        }
        let lastPageNumber = Math.ceil(length/10)
        let prevPage = parseInt(page)-1
        let nextPage = parseInt(page)+1
        if (prevPage < 1) {
          prevPage = 1
        }
        if (nextPage > lastPageNumber) {
          nextPage = lastPageNumber
        }
        if (page > lastPageNumber) {
          res.redirect("/orders?page="+lastPageNumber)
          return
        }
        if(page < 1) {
          res.redirect("/orders?page=1")
          return
        }
        if(tmp.length > 10) {
          tmp = tmp.slice(0, 10)
        }
        orders = tmp
        let orderFromDb = [];
        orders.forEach((order) => {
          orderFromDb.push({
            order : {
              id: order.id,
              client_name: order.nom,
              order_date: order.created_at,
              delivery_date: order.livraison,
              status: order.status
            },
            links: {
              self: {
                href: "/orders/"+order.id+"/"
              }
            }
          });
        });
        res.setHeader("Content-Type", "application/json");
        res.status(200).send({
          type: "collection",
          count: length,
          link : {
            next : {
              href : "/orders?page="+nextPage
            },
            prev : {
              href : "/orders?page="+prevPage
            },
            last : {
              href : "/orders?page="+lastPageNumber
            },
            first : {
              href : "/orders?page=1"
            }
          },
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
            res.status(201).send({link : "/" + id + "?embed=items"});
          }
        } else {
          infoHandler({status : 201, message : "Commande ajoutée : /orders/" + id}, req)
          res.status(201).send({link : "/" + id});
        }
      }
    } catch (err) {
      next(createDetails(500, err));
    }
  })
  .all((req, res, next) => {
    next(createDetailsPerso(405, { message: "Méthode non autorisée : /orders : " + req.method, file: __filename, line: 169}));
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
