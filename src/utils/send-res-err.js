const log = require('../configs/log');

const { HttpStatus } = require('./enums');

function sendResErr(res, resErr) {
  if (!resErr.errInfo) {
    resErr.errInfo = { stack: new Error().stack };
  }

  if (resErr.status === HttpStatus.INTERNAL_SERVER_ERROR) {
    log.error(resErr);
  } else {
    log.warn(resErr);
  }
  res.status(resErr.status).json({ message: resErr.message });
}

module.exports = sendResErr;
