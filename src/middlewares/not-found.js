const sendResErr = require('../utils/send-res-err');
const { HttpStatus, Messages } = require('../utils/enums');

const notFound = async (req, res, next) => {
  sendResErr(res, {
    status: HttpStatus.NOT_FOUND,
    message: Messages.ROUTE_NOT_FOUND,
    errInfo: {
      method: req.method,
      path: req.path,
      query: req.query,
      body: req.body
    }
  });
};

module.exports = notFound;
