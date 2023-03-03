const { UniqueConstraintError, ForeignKeyConstraintError, ValidationError } = require('sequelize');

function getErrInfo(err) {
  if (err instanceof ForeignKeyConstraintError || err instanceof UniqueConstraintError) {
    return {
      name: err.name,
      sql: err.original.sql,
      parameters: err.original.parameters,
      message: err.original.detail,
      constraint: err.original.constraint,
      table: err.original.table
    };
  } else if (err instanceof ValidationError) {
    const name = err.name;
    err = err.errors[0];
    return {
      name,
      message: err.message,
      type: err.type,
      field: err.path,
      validatorKey: err.validatorKey,
      validatorName: err.validatorName,
      validatorArgs: err.validatorArgs
    };
  }

  return err;
}

function createResErr(err) {
  const errInfo = getErrInfo(err);

  if (err instanceof ForeignKeyConstraintError) {
    if (errInfo.table === 'product_category') {
      return { status: 400, message: 'invalid categories', errInfo };
    }
  } else if (err instanceof UniqueConstraintError) {
    if (errInfo.table === 'user') {
      if (errInfo.constraint === 'user_username_key') {
        return { status: 409, message: 'username already exists', errInfo };
      } else if (errInfo.constraint === 'user_phone_key') {
        return { status: 409, message: 'phone already exists', errInfo };
      }
    }
  } else if (err instanceof ValidationError) {
    if (errInfo.field === 'userType') {
      return { status: 400, message: 'invalid user type', errInfo };
    }
  }

  return { status: 500, message: 'unexpected error', err };
}

module.exports = createResErr;
