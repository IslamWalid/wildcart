require('dotenv').config();
require('./src/utils/check-env')();

const config = require('config');

const app = require('./app');
const log = require('./src/configs/log');

const serverConfig = config.get('server');
app.listen(serverConfig.port, () => {
  log.info(`server is listening on port ${serverConfig.port}`);
});
