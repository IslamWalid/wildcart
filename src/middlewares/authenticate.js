const sendResErr = require('../utils/send-res-err');
const { HttpStatus, Messages } = require('../utils/enums');

const authenticateUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  sendResErr(res, { status: HttpStatus.UNAUTHORIZED, message: Messages.UNAUTHORIZED });
};

const authenticateCustomer = (req, res, next) => {
  if (req.isAuthenticated() && req.user.userType === 'customer') {
    return next();
  }

  sendResErr(res, { status: HttpStatus.UNAUTHORIZED, message: Messages.UNAUTHORIZED });
};

const authenticateSeller = (req, res, next) => {
  if (req.isAuthenticated() && req.user.userType === 'seller') {
    return next();
  }

  sendResErr(res, { status: HttpStatus.UNAUTHORIZED, message: Messages.UNAUTHORIZED });
};

module.exports = {
  authenticateUser,
  authenticateSeller,
  authenticateCustomer
};
