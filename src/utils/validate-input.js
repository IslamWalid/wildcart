const validator = require('validator');

const inputTypes = {
  LOGIN: 0,
  REGISTER: 1,
  POST_PRODUCT: 2,
  POST_REVIEW: 3
};

function validateRegister(input) {
  const { username, firstName, lastName, password } = input;
  const { phone, address, shopName, userType } = input;

  if (!username || !firstName || !lastName || !password || !phone || !address || !userType) {
    return 'required fields are missing';
  }

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

function validatePostProduct(input) {
  const { name, brand, quantity, price, categories } = input;

  if (!name || !brand || !quantity || !price || !categories) {
    return 'required fields are missing';
  }

  return null;
}

function validatePostReview(input) {
  const { rate, comment } = input;

  if (!rate || !comment) {
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

    case inputTypes.POST_PRODUCT:
      return validatePostProduct(input);

    case inputTypes.POST_REVIEW:
      return validatePostReview(input);
  }
}

module.exports = {
  inputTypes,
  validateInput
};
