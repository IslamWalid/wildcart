const {
  UniqueConstraintError,
  ForeignKeyConstraintError,
  DatabaseError
} = require('sequelize');

const { HttpStatus, Messages } = require('../enums');

const DATA_TYPE_ERROR_CODE = '22P02';

function databaseErrInfo(err) {
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
  const errInfo = databaseErrInfo(err);
  if (!errInfo) {
    return null;
  }

  switch (errInfo.meta.constraint) {
    case DATA_TYPE_ERROR_CODE:
      return { status: HttpStatus.BAD_REQUEST, message: Messages.INVALID_DATATYPE, errInfo };
    case 'products_categories_category_name_fkey':
      return { status: HttpStatus.BAD_REQUEST, message: Messages.INVALID_CATEGORY, errInfo };
    case 'reviews_product_id_fkey':
      return { status: HttpStatus.NOT_FOUND, message: Messages.NOT_FOUND, errInfo };
    case 'users_username_key':
      return { status: HttpStatus.CONFLICT, message: Messages.USERNAME_ALREADY_EXISTS, errInfo };
    case 'users_phone_key':
      return { status: HttpStatus.CONFLICT, message: Messages.PHONE_ALREADY_EXISTS, errInfo };
    case 'product_name_seller_id_unique_constraint':
      return { status: HttpStatus.CONFLICT, message: Messages.PRODUCT_NAME_ALREADY_EXISTS, errInfo };
    case 'reviews_pkey':
      return { status: HttpStatus.CONFLICT, message: Messages.REVIEW_ALREADY_EXISTS, errInfo };
    default:
      return null;
  }
}

module.exports = databaseResErr;
