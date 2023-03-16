const { sendResErr } = require('../utils/err-handler');

const authenticateUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  sendResErr(res, { status: 401, message: 'unauthorized user' });
};

const authenticateCustomer = (req, res, next) => {
  if (req.isAuthenticated() && req.user.userType === 'customer') {
    return next();
  }

  sendResErr(res, { status: 401, message: 'unauthorized user' });
};

const authenticateSeller = (req, res, next) => {
  if (req.isAuthenticated() && req.user.userType === 'seller') {
    return next();
  }

  sendResErr(res, { status: 401, message: 'unauthorized user' });
};

module.exports = {
  authenticateUser,
  authenticateSeller,
  authenticateCustomer
};
