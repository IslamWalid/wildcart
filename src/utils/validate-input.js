const validator = require('validator');

const { Roles, Messages, InputTypes } = require('./enums');

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
    case InputTypes.REGISTER:
      return validateRegister(input);

    case InputTypes.POST_PRODUCT:
      return validatePostProduct(input);

    case InputTypes.PATCH_PRODUCT:
      return validatePatchProduct(input);

    case InputTypes.POST_REVIEW:
      return validatePostReview(input);

    case InputTypes.PATCH_REVIEW:
      return validatePatchReview(input);

    case InputTypes.POST_ORDER:
      return validatePostOrder(input);
  }
}

module.exports = validateInput;
