const { HttpStatus } = require('../enums');

function joiResErr(err) {
  if (err.isJoi && err.name === 'ValidationError') {
    return { status: HttpStatus.BAD_REQUEST, message: err.message, errInfo: err };
  }

  return null;
}

module.exports = joiResErr;
