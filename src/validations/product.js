const joi = require('joi');

const postProduct = joi.object({
  name: joi.string().required(),
  brand: joi.string().required(),
  quantity: joi.number().integer().required(),
  price: joi.number().integer().required(),
  categories: joi.array().required()
});

const patchProduct = joi.object({
  name: joi.string(),
  brand: joi.string(),
  quantity: joi.number().integer(),
  price: joi.number().integer(),
  categories: joi.array()
});

module.exports = {
  postProduct,
  patchProduct
};
