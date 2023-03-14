const sendResErr = require('../utils/send-res-err');

const authenticateUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  sendResErr(res, 401, 'unauthorized user');
};

const authenticateCustomer = (req, res, next) => {
  if (req.isAuthenticated() && req.user.userType === 'customer') {
    return next();
  }

  sendResErr(res, 401, 'unauthorized user');
};

const authenticateSeller = (req, res, next) => {
  if (req.isAuthenticated() && req.user.userType === 'seller') {
    return next();
  }

  sendResErr(res, 401, 'unauthorized user');
};

module.exports = {
  authenticateUser,
  authenticateSeller,
  authenticateCustomer
};
