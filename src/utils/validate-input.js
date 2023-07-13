const validator = require('validator');

const { Roles, Messages } = require('./enums');

const inputTypes = {
  REGISTER: 0,
  POST_PRODUCT: 1,
  PATCH_PRODUCT: 2,
  POST_REVIEW: 3,
  PATCH_REVIEW: 4,
  POST_ORDER: 5
};

function validateRegister(input) {
  const { username, firstName, lastName, password } = input;
  const { phone, address, shopName, role } = input;

  if (!username || !firstName || !lastName || !password || !phone || !address || !role) {
    return Messages.MISSING_FIELDS;
  }

  if (role === Roles.SELLER && !shopName) {
    return Messages.MISSING_FIELDS;
  }

  if (!validator.isStrongPassword(password)) {
    return Messages.WEAK_PASSWORD;
  }

  if (!validator.isMobilePhone(phone)) {
    return Messages.INVALID_PHONE;
  }

  return null;
}

function validatePostProduct(input) {
  const { name, brand, quantity, price } = input;

  if (!name || !brand || !quantity || !price) {
    return 'required fields are missing';
  }

  return null;
}

function validatePatchProduct(input) {
  const { name, brand, quantity, price, categories } = input;

  if (!name && !brand && !quantity && !price && !categories) {
    return Messages.MISSING_FIELDS;
  }

  return null;
}

function validatePostReview(input) {
  const { rate, comment } = input;

  if (!rate || !comment) {
    return Messages.MISSING_FIELDS;
  }

  return null;
}

function validatePatchReview(input) {
  const { rate, comment } = input;

  if (!rate && !comment) {
    return Messages.MISSING_FIELDS;
  }

  return null;
}

function validatePostOrder(input) {
  const { quantity } = input;

  if (!quantity) {
    return Messages.MISSING_FIELDS;
  }

  return null;
}

function validateInput(input, inputType) {
  switch (inputType) {
    case inputTypes.REGISTER:
      return validateRegister(input);

    case inputTypes.POST_PRODUCT:
      return validatePostProduct(input);

    case inputTypes.PATCH_PRODUCT:
      return validatePatchProduct(input);

    case inputTypes.POST_REVIEW:
      return validatePostReview(input);

    case inputTypes.PATCH_REVIEW:
      return validatePatchReview(input);

    case inputTypes.POST_ORDER:
      return validatePostOrder(input);
  }
}

module.exports = {
  inputTypes,
  validateInput
};
