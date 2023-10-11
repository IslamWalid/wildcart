const joi = require('joi');

const { OrderStatus } = require('../utils/enums');

const post = joi.object({
  quantity: joi.number().integer().required()
});

const patch = joi.object({
  status: joi.string().valid(OrderStatus.SHIPPED, OrderStatus.ARRIVED).required()
});

module.exports = {
  post,
  patch
};
