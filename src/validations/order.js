const joi = require('joi');

const postOrder = joi.object({
  quantity: joi.number().integer().required()
});

module.exports = { postOrder };
