const config = require('config');

module.exports = { ...config.get('dbConfig') };
