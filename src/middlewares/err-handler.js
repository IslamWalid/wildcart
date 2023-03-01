const log = require('../configs/log-config');
const { UniqueConstraintError, ValidationError } = require('sequelize');

function extractErrInfo(err) {
  const sql = err.sql;
  const error = err.errors[0];

  return {
    sql,
    message: error.message,
    type: error.type,
    field: error.path,
    value: error.value,
    validatorArgs: error.validatorArgs[0]
  };
}

const errHandler = async (err, req, res, next) => {
  if (err instanceof UniqueConstraintError) {
    const errInfo = extractErrInfo(err);
    log.info(errInfo);
    res.status(409).json({ message: `${errInfo.field} already exists` });
  } else if (err instanceof ValidationError) {
    const errInfo = extractErrInfo(err);
    log.info(errInfo);
    res.status(400).json({
      message: `${errInfo.field} must have a valid value`,
      validValues: errInfo.validatorArgs
    });
  } else {
    log.error({ message: 'unexpected error', err });
    res.sendStatus(500);
  }
};

module.exports = errHandler;
