const sendResErr = require('../utils/send-res-err');
const { UNAUTHORIZED } = require('../utils/http-status');

const authenticateUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  sendResErr(res, { status: UNAUTHORIZED, message: 'unauthorized user' });
};

const authenticateCustomer = (req, res, next) => {
  if (req.isAuthenticated() && req.user.userType === 'customer') {
    return next();
  }

  sendResErr(res, { status: UNAUTHORIZED, message: 'unauthorized user' });
};

const authenticateSeller = (req, res, next) => {
  if (req.isAuthenticated() && req.user.userType === 'seller') {
    return next();
  }

  sendResErr(res, { status: UNAUTHORIZED, message: 'unauthorized user' });
};

module.exports = {
  authenticateUser,
  authenticateSeller,
  authenticateCustomer
};
