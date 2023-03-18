const log = require('../configs/log');

function sendResErr(res, resErr) {
  if (!resErr.errInfo) {
    resErr.errInfo = { stack: new Error().stack };
  }

  if (resErr.status === 500) {
    log.error(resErr);
  } else {
    log.warn(resErr);
  }
  res.status(resErr.status).json({ message: resErr.message });
}

module.exports = sendResErr;
