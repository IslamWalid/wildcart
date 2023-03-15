const config = require('config');
const winston = require('winston');

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const log = winston.createLogger({
  level: config.get('log').level,
  levels: logLevels,
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  transports: [new winston.transports.Console()]
});

module.exports = log;
