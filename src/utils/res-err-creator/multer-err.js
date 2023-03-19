const { MulterError } = require('multer');

const log = require('../../configs/log');
const { BAD_REQUEST } = require('../http-status');

function multerErrInfo(err) {
  return {
    ...err
  };
}

function multerResErr(err) {
  log.debug('creating multer response error');

  if (err instanceof MulterError) {
    const errInfo = multerErrInfo(err);

    switch (errInfo.code) {
      case 'FILE_FILTER':
        return { status: BAD_REQUEST, message: errInfo.message, errInfo };
      case 'MISSING_FIELD_NAME':
        return { status: BAD_REQUEST, message: errInfo.message, errInfo };
      case 'LIMIT_PART_COUNT':
        return { status: BAD_REQUEST, message: errInfo.message, errInfo };
      case 'LIMIT_FILE_SIZE':
        return { status: BAD_REQUEST, message: errInfo.message, errInfo };
      case 'LIMIT_FILE_COUNT':
        return { status: BAD_REQUEST, message: errInfo.message, errInfo };
      case 'LIMIT_FIELD_KEY':
        return { status: BAD_REQUEST, message: errInfo.message, errInfo };
      case 'LIMIT_FIELD_VALUE':
        return { status: BAD_REQUEST, message: errInfo.message, errInfo };
      case 'LIMIT_FIELD_COUNT':
        return { status: BAD_REQUEST, message: errInfo.message, errInfo };
      case 'LIMIT_UNEXPECTED_FILE':
        return { status: BAD_REQUEST, message: errInfo.message, errInfo };
    }
  }

  log.debug('error does not match any defined multer error type');
  return null;
}

module.exports = multerResErr;
