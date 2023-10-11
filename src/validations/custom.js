const validator = require('validator');

const { Messages } = require('../utils/enums');

const password = (value, helper) => {
  if (!validator.isStrongPassword(value)) {
    return helper.message(Messages.WEAK_PASSWORD);
  }

  return value;
};

const phone = (value, helper) => {
  if (!validator.isMobilePhone(value, ['ar-EG'], { strictMode: true })) {
    return helper.message(Messages.INVALID_PHONE);
  }

  return value;
};

module.exports = {
  password,
  phone
};
