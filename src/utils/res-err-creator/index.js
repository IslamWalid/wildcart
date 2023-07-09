const path = require('path');
const fs = require('fs');

const { HttpStatus } = require('../enums');

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

function createResErr(err) {
  const resErr = resErrCreators.reduce((aggregated, creator) => {
    return aggregated || creator(err);
  }, null);

  return resErr || { status: HttpStatus.INTERNAL_SERVER_ERROR, message: 'unexpected error', errInfo: err };
}

module.exports = createResErr;
