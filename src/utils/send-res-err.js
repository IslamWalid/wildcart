const log = require('../configs/log-config');

function sendResErr(res, status, message) {
  log.warn({ status, message, trace: new Error().stack });
  res.status(status).json({ message });
}

module.exports = sendResErr;
