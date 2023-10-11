const joi = require('joi');
const validator = require('validator');

const { Roles, Messages } = require('../utils/enums');

const validatePassword = (value, helper) => {
  if (!validator.isStrongPassword(value)) {
    return helper.message(Messages.WEAK_PASSWORD);
  }

  return value;
};

const validatePhone = (value, helper) => {
  if (!validator.isMobilePhone(value, ['ar-EG'], { strictMode: true })) {
    return helper.message(Messages.INVALID_PHONE);
  }

  return value;
};

const register = joi.object({
  username: joi.string().required(),
  firstName: joi.string().required(),
  lastName: joi.string().required(),
  password: joi.string().required().custom(validatePassword),
  phone: joi.string().required().custom(validatePhone),
  address: joi.string().required(),
  role: joi.string().required().valid(Roles.CUSTOMER, Roles.SELLER),
  shopName: joi.when('role', {
    is: Roles.SELLER,
    then: joi.string().required()
  })
});

module.exports = { register };
