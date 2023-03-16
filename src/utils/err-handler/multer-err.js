const { MulterError } = require('multer');

const log = require('../../configs/log');

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
      case 'LIMIT_PART_COUNT':
        return { status: 400, message: 'too many parts', errInfo };
      case 'LIMIT_FILE_SIZE':
        return { status: 400, message: 'file too large', errInfo };
      case 'LIMIT_FILE_COUNT':
        return { status: 400, message: 'too many files', errInfo };
      case 'LIMIT_FIELD_KEY':
        return { status: 400, message: 'field name too long', errInfo };
      case 'LIMIT_FIELD_VALUE':
        return { status: 400, message: 'field value too long', errInfo };
      case 'LIMIT_FIELD_COUNT':
        return { status: 400, message: 'too many fields', errInfo };
      case 'LIMIT_UNEXPECTED_FILE':
        return { status: 400, message: 'unexpected fields', errInfo };
      case 'MISSING_FIELD_NAME':
        return { status: 400, message: 'field name missing', errInfo };
    }
  }

  log.debug('error does not match any defined multer error type');
  return null;
}

module.exports = multerResErr;
