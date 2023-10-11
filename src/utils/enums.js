const Roles = {
  CUSTOMER: 'customer',
  SELLER: 'seller'
};

const OrderStatus = {
  UNPAID: 'unpaid',
  PENDING: 'pending',
  SHIPPED: 'shipped',
  ARRIVED: 'arrived'
};

const HttpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

const Messages = {
  MISSING_SHOPNAME: '"shopName" is required for users of role "seller"',
  INVALID_USERNAME: 'invalid username',
  INVALID_PASSWORD: 'invalid password',
  INVALID_DATATYPE: 'invalid input datatype error',
  INVALID_CATEGORY: 'invalid product categories',
  INVALID_QUANTITY: 'order quantity greater than available products',
  INVALID_PHONE: 'invalid phone number',
  WEAK_PASSWORD: 'weak password',
  UNAUTHORIZED: 'user is unauthorized',
  ROUTE_NOT_FOUND: 'requested route not found',
  NOT_FOUND: 'requested resource not found',
  USERNAME_ALREADY_EXISTS: 'user with this username already exists',
  PHONE_ALREADY_EXISTS: 'user with this phone number already exists',
  PRODUCT_NAME_ALREADY_EXISTS: 'user already has product with this name',
  REVIEW_ALREADY_EXISTS: 'user has alreayd reviewed this product',
  CANCEL_REFUSED: 'order can only be canceled in unpaid or pending status',
  ORDER_NOT_FOUND: 'order does not exist',
  UNEXPECTED_ERROR: 'unexpected error'
};

module.exports = {
  Roles,
  OrderStatus,
  HttpStatus,
  Messages
};
