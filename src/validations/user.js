const joi = require('joi');

const { Roles } = require('../utils/enums');

const { phone, password } = require('./custom');

const register = joi.object({
  username: joi.string().required(),
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  password: joi.string().required().custom(password),
  phone: joi.string().required().custom(phone),
  address: joi.string().required(),
  role: joi.string().required().valid(Roles.CUSTOMER, Roles.SELLER),
  shopName: joi.when('role', {
    is: Roles.SELLER,
    then: joi.string().required()
  })
});

module.exports = {
  register
};
