const joi = require('joi');

const orderValidator = {
    updateOrder: joi.object({
        nom: joi.string().required(),
        livraison: joi.string().required(),
        mail: joi.string().email().required()
    })
}

function validateUpdate(req, res , next) {
    const { error } = orderValidator.updateOrder.validate(req.body);
    if (error) {
        res.status(400).send({
            type: "error",
            error: 400,
            message: error.details[0].message
        });
    } else {
        next();
    }
}


module.exports = {
    validateUpdate
}