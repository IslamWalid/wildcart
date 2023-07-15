const sendResErr = require('../utils/send-res-err');
const { HttpStatus, Messages } = require('../utils/enums');

const authenticate = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return sendResErr(res, { status: HttpStatus.UNAUTHORIZED, message: Messages.UNAUTHORIZED });
  }

  next();
};

module.exports = authenticate;
