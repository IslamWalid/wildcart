const validator = require('validator');

const inputTypes = {
  LOGIN: 0,
  REGISTER: 1,
  CREATE_PRODUCT: 2
};

function validateRegister(input) {
  const { username, firstName, lastName, password } = input;
  const { phone, address, shopName, userType } = input;

  if (!username || !firstName || !lastName || !password || !phone || !address || !userType) {
    return 'required fields are missing';
  }

  // if (userType !== 'customer' && userType !== 'seller') {
  //   return 'userType must be customer or seller only';
  // }

  if (userType === 'seller' && !shopName) {
    return 'required fields are missing';
  }

  if (!validator.isStrongPassword(password)) {
    return 'weak password';
  }

  if (!validator.isMobilePhone(phone)) {
    return 'invalid phone number';
  }

  return null;
}

function validateLogin(input) {
  const { username, password } = input;

  if (!username || !password) {
    return 'required fields are missing';
  }

  return null;
}

function validateCreateProduct(input) {
  const { name, brand, quantity, price, categories } = input;

  if (!name || !brand || !quantity || !price || !categories) {
    return 'required fields are missing';
  }

  return null;
}

function validateInput(input, inputType) {
  switch (inputType) {
    case inputTypes.REGISTER:
      return validateRegister(input);

    case inputTypes.LOGIN:
      return validateLogin(input);

    case inputTypes.CREATE_PRODUCT:
      return validateCreateProduct(input);
  }
}

module.exports = {
  inputTypes,
  validateInput
};
