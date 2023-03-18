const sendResErr = require('../utils/send-res-err');

const notFound = async (req, res, next) => {
  sendResErr(res, {
    status: 404,
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
