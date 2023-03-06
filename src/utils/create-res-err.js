const {
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError
} = require('sequelize');

const log = require('../configs/log-config');

const DATA_TYPE_ERROR_CODE = '22P02';

function getErrInfo(err) {
  switch (true) {
    case err instanceof UniqueConstraintError:
      return {
        message: err.parent.detail,
        meta: {
          name: err.name,
          sql: err.parent.sql,
          parameters: err.parent.parameters,
          constraint: err.parent.constraint,
          table: err.parent.table
        }
      };

    case err instanceof ForeignKeyConstraintError:
      return {
        message: err.original.detail,
        meta: {
          name: err.name,
          sql: err.original.sql,
          parameters: err.original.parameters,
          constraint: err.original.constraint,
          table: err.original.table
        }
      };

    case err instanceof DatabaseError:
      return {
        message: err.message,
        meta: {
          name: err.name,
          sql: err.sql,
          parameters: err.parameters,
          constraint: err.parent.code
        }
      };

    default:
      return {
        message: 'unexpected error',
        meta: err
      };
  }
}

function createResErr(err) {
  log.debug({
    message: 'debug error before calling getErrInfo in createResErr',
    meta: err
  });

  const errInfo = getErrInfo(err);

  switch (errInfo.meta.constraint) {
    case DATA_TYPE_ERROR_CODE:
      return { status: 400, message: 'invalid input datatype', errInfo };
    case 'product_category_category_name_fkey':
      return { status: 400, message: 'invalid categories', errInfo };
    case 'user_username_key':
      return { status: 409, message: 'username already exists', errInfo };
    case 'user_phone_key':
      return { status: 409, message: 'phone already exists', errInfo };
    case 'product_name_seller_id_unique_constraint':
      return { status: 409, message: 'product name already exists for this seller', errInfo };
  }

  return { status: 500, message: 'unexpected error', errInfo };
}

module.exports = createResErr;
