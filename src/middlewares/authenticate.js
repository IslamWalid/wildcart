const sendResErr = require('../utils/send-res-err');
const { HttpStatus, Messages, Roles } = require('../utils/enums');

const authenticateUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  sendResErr(res, { status: HttpStatus.UNAUTHORIZED, message: Messages.UNAUTHORIZED });
};

const authenticateCustomer = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === Roles.CUSTOMER) {
    return next();
  }

  sendResErr(res, { status: HttpStatus.UNAUTHORIZED, message: Messages.UNAUTHORIZED });
};

const authenticateSeller = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'seller') {
    return next();
  }

  sendResErr(res, { status: HttpStatus.UNAUTHORIZED, message: Messages.UNAUTHORIZED });
};

module.exports = {
  authenticateUser,
  authenticateSeller,
  authenticateCustomer
};
