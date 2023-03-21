const validator = require('validator');

const inputTypes = {
  LOGIN: 0,
  REGISTER: 1,
  POST_PRODUCT: 2,
  PATCH_PRODUCT: 3,
  POST_REVIEW: 4,
  PATCH_REVIEW: 5
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
  const { name, brand, quantity, price } = input;

  if (!name || !brand || !quantity || !price) {
    return 'required fields are missing';
  }

  return null;
}

function validatePatchProduct(input) {
  const { name, brand, quantity, price, categories } = input;

  if (!name && !brand && !quantity && !price && !categories) {
    return 'provide at least one field';
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

function validatePatchReview(input) {
  const { rate, comment } = input;

  if (!rate && !comment) {
    return 'provide at least one field';
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

    case inputTypes.PATCH_PRODUCT:
      return validatePatchProduct(input);

    case inputTypes.POST_REVIEW:
      return validatePostReview(input);

    case inputTypes.PATCH_REVIEW:
      return validatePatchReview(input);
  }
}

module.exports = {
  inputTypes,
  validateInput
};
