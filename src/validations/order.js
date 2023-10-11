const joi = require('joi');

const post = joi.object({
  quantity: joi.number().integer().required()
});

module.exports = { post };
