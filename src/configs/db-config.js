const config = require('config');

module.exports = Object.assign({}, config.get('dbConfig'));
