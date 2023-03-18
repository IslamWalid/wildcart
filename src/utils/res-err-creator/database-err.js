const {
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError
} = require('sequelize');

const log = require('../../configs/log');

const DATA_TYPE_ERROR_CODE = '22P02';

function databaseErrInfo(err) {
  log.debug('parsing database error info');

  switch (true) {
    case err instanceof UniqueConstraintError:
      return {
        message: err.parent.detail,
        stack: err.stack,
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
        stack: err.stack,
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
        stack: err.stack,
        meta: {
          name: err.name,
          sql: err.sql,
          parameters: err.parameters,
          constraint: err.parent.code
        }
      };

    default:
      return null;
  }
}

function databaseResErr(err) {
  log.debug('creating database response error');

  const errInfo = databaseErrInfo(err);
  if (!errInfo) {
    return null;
  }

  switch (errInfo.meta.constraint) {
    case DATA_TYPE_ERROR_CODE:
      return { status: 400, message: 'invalid input datatype', errInfo };
    case 'product_category_category_name_fkey':
      return { status: 400, message: 'invalid categories', errInfo };
    case 'image_product_id_fkey':
      return { status: 404, message: 'product does not exist', errInfo };
    case 'image_pkey':
      return { status: 409, message: 'product already has an image', errInfo };
    case 'user_username_key':
      return { status: 409, message: 'username already exists', errInfo };
    case 'user_phone_key':
      return { status: 409, message: 'phone already exists', errInfo };
    case 'product_name_seller_id_unique_constraint':
      return { status: 409, message: 'product name already exists for this seller', errInfo };
    default:
      log.debug('error does not match any defined database error type');
      return null;
  }
}

module.exports = databaseResErr;
