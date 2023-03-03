const log = require('../configs/log-config');

const errHandler = async (err, req, res, next) => {
  log.debug(err);

  if (!err.status) {
    log.error({ message: 'unexpected error', err });
    return res.status(500).json({ message: 'unexpected error' });
  }

  if (err.status === 500) {
    log.error(err.errInfo);
  } else {
    log.warn(err.errInfo);
  }

  res.status(err.status).json({ message: err.message });
};

module.exports = errHandler;
