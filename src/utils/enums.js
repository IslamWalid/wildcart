const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

const Messages = {
  INVALID_USERNAME: 'invalid username',
  INVALID_PASSWORD: 'invalid password',
  UNAUTHORIZED: 'user is unauthorized',
  ROUTE_NOT_FOUND: 'requested route not found',
  NOT_FOUND: 'requested resource not found',
  MISSING_FIELDS: 'required fields are missing',
  INVALID_DATATYPE: 'invalid input datatype error',
  INVALID_CATEGORY: 'invalid product categories',
  USERNAME_ALREADY_EXISTS: 'user with this username already exists',
  PHONE_ALREADY_EXISTS: 'user with this phone number already exists',
  PRODUCT_NAME_ALREADY_EXISTS: 'user already has product with this name',
  REVIEW_ALREADY_EXISTS: 'user has alreayd reviewed this product',
  UNEXPECTED_ERROR: 'unexpected error'
};

const Roles = {
  CUSTOMER: 'customer',
  SELLER: 'seller'
};

module.exports = {
  HttpStatus,
  Messages,
  Roles
};
