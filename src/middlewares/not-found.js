const sendResErr = require('../utils/send-res-err');
const { NOT_FOUND } = require('../utils/http-status');

const notFound = async (req, res, next) => {
  sendResErr(res, {
    status: NOT_FOUND,
    message: 'resource not found',
    errInfo: {
      method: req.method,
      path: req.path,
      query: req.query,
      body: req.body
    }
  });
};

module.exports = notFound;
