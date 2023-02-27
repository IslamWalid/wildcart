const log = require('../configs/log-config');
const { UniqueConstraintError } = require('sequelize');

const errHandler = async (err, req, res, next) => {
  log.debug(err);
  if (err instanceof UniqueConstraintError) {
    log.info({
      message: 'element already exist',
      fields: err.fields,
      status: 409,
      table: err.original.table
    });
    res.status(409).json({ message: 'username already exists' });
  } else if (err.status) {
    log.info(err);
    res.status(err.status).json({ message: err.message });
  } else {
    log.error(err);
    res.sendStatus(500);
  }
};

module.exports = errHandler;
