const path = require('path');
const fs = require('fs');

const log = require('../../configs/log');

const basename = path.basename(__filename);

const resErrCreators = [];

fs
  .readdirSync(__dirname)
  .filter((file) => (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js' &&
    file.indexOf('.test.js') === -1
  ))
  .forEach((file) => {
    const creator = require(path.join(__dirname, file));
    resErrCreators.push(creator);
  });

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

function createResErr(err) {
  const resErr = resErrCreators.reduce((aggregated, creator) => {
    return aggregated || creator(err);
  }, null);

  return resErr || { status: 500, message: 'unexpected error', errInfo: err };
}

module.exports = {
  sendResErr,
  createResErr
};
