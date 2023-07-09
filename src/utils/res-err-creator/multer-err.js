const { MulterError } = require('multer');

const { HttpStatus } = require('../enums');

function multerErrInfo(err) {
  return {
    ...err
  };
}

function multerResErr(err) {
  if (err instanceof MulterError) {
    const errInfo = multerErrInfo(err);

    switch (errInfo.code) {
      case 'FILE_FILTER':
        return { status: HttpStatus.BAD_REQUEST, message: errInfo.message, errInfo };
      case 'MISSING_FIELD_NAME':
        return { status: HttpStatus.BAD_REQUEST, message: errInfo.message, errInfo };
      case 'LIMIT_PART_COUNT':
        return { status: HttpStatus.BAD_REQUEST, message: errInfo.message, errInfo };
      case 'LIMIT_FILE_SIZE':
        return { status: HttpStatus.BAD_REQUEST, message: errInfo.message, errInfo };
      case 'LIMIT_FILE_COUNT':
        return { status: HttpStatus.BAD_REQUEST, message: errInfo.message, errInfo };
      case 'LIMIT_FIELD_KEY':
        return { status: HttpStatus.BAD_REQUEST, message: errInfo.message, errInfo };
      case 'LIMIT_FIELD_VALUE':
        return { status: HttpStatus.BAD_REQUEST, message: errInfo.message, errInfo };
      case 'LIMIT_FIELD_COUNT':
        return { status: HttpStatus.BAD_REQUEST, message: errInfo.message, errInfo };
      case 'LIMIT_UNEXPECTED_FILE':
        return { status: HttpStatus.BAD_REQUEST, message: errInfo.message, errInfo };
    }
  }

  return null;
}

module.exports = multerResErr;
