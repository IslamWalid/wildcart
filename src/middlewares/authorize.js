const sendResErr = require('../utils/send-res-err');
const { HttpStatus, Messages } = require('../utils/enums');

const authorize = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return sendResErr(res, { status: HttpStatus.UNAUTHORIZED, message: Messages.UNAUTHORIZED });
  }

  next();
};

module.exports = authorize;
