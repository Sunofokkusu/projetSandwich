const joi = require('joi');

const userValidator = {
    insertUser: joi.object({
        email: joi.string().email().required(),
        username: joi.string().required(),
        password: joi.string().required(),
    }),
}

function validateInsert(req, res, next) {
    const { error } = userValidator.insertUser.validate(req.body);
    if(error) {
        res.status(400).send({
            type: 'error',
            error: 400,
            message: error.details[0].message
        });
    }else{
        next();
    }
}

module.exports = {
    validateInsert
}