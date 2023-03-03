const joi = require("joi");

const orderValidator = {
  updateOrder: joi.object({
    nom: joi.string().required(),
    livraison: joi.string().required(),
    mail: joi.string().email().required(),
  }),
  insertOrder: joi.object({
    client_name: joi.string().required(),
    client_mail: joi.string().email().required(),
    delivery: joi.object({
      date: joi.string().required(),
      time: joi.string().required(),
    }),
    items: joi.array().items({
      uri: joi.string().required(),
      q: joi.number().required(),
      name: joi.string().required(),
      price: joi.number().required(),
    }),
  }),
};

function validateUpdate(req, res, next) {
  const { error } = orderValidator.updateOrder.validate(req.body);
  if (error) {
    res.status(400).send({
      type: "error",
      error: 400,
      message: error.details[0].message,
    });
  } else {
    next();
  }
}

function validateInsert(req, res, next) {
  const { error } = orderValidator.insertOrder.validate(req.body);
  if (error) {
    res.status(400).send({
      type: "error",
      error: 400,
      message: error.details[0].message,
    });
  } else {
    next();
  }
}

module.exports = {
  validateUpdate,
  validateInsert,
};
