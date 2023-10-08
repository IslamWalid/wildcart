require('dotenv').config();

const config = require('config');

const username = config.has('dbConfig.username') ? config.get('dbConfig.username') : process.env.POSTGRES_USER;
const password = config.has('dbConfig.password') ? config.get('dbConfig.password') : process.env.POSTGRES_PASSWORD;

if (!username) {
  console.error('postgres username is not set');
  process.exit(1);
}

if (!password) {
  console.error('postgres password is not set');
  process.exit(1);
}

module.exports = {
  ...config.get('dbConfig'),
  username,
  password
};
