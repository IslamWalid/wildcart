const log = require('../configs/log');
const sendResErr = require('../utils/send-res-err');
const createResErr = require('../utils/res-err-creator');

const errHandler = async (err, req, res, next) => {
  log.debug('handling error in errHandler middleware');

  const resErr = createResErr(err);

  if (!resErr.status) {
    return sendResErr(res, {
      status: 500,
      message: 'unexpected error',
      errInfo: err
    });
  }

  sendResErr(res, resErr);
};

module.exports = errHandler;
