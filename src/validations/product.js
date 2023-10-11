const joi = require('joi');

const post = joi.object({
  name: joi.string().required(),
  brand: joi.string().required(),
  quantity: joi.number().integer().required(),
  price: joi.number().integer().required(),
  categories: joi.array().required()
});

const patch = joi.object({
  quantity: joi.number().integer(),
  price: joi.number().integer()
});

module.exports = {
  post,
  patch
};
