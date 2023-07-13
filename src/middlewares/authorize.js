const { HttpStatus, Messages } = require('../utils/enums');
const sendResErr = require('../utils/send-res-err');

const authorize = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return sendResErr(res, { status: HttpStatus.UNAUTHORIZED, message: Messages.UNAUTHORIZED });
    }

    next();
  };
};

module.exports = authorize;
