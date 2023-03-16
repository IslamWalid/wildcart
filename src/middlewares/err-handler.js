const log = require('../configs/log');
const { sendResErr } = require('../utils/err-handler');

const errHandler = async (err, req, res, next) => {
  log.debug('handling error in errHandler middleware');

  if (!err.status) {
    return sendResErr(res, {
      status: 500,
      message: 'unexpected error',
      errInfo: err
    });
  }

  sendResErr(res, err);
};

module.exports = errHandler;
