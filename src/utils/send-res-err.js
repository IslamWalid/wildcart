const log = require('../configs/log');

const { INTERNAL_SERVER_ERROR } = require('./http-status');

function sendResErr(res, resErr) {
  if (!resErr.errInfo) {
    resErr.errInfo = { stack: new Error().stack };
  }

  if (resErr.status === INTERNAL_SERVER_ERROR) {
    log.error(resErr);
  } else {
    log.warn(resErr);
  }
  res.status(resErr.status).json({ message: resErr.message });
}

module.exports = sendResErr;
