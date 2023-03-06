require('dotenv').config();
require('./src/utils/check-env')();

const config = require('config');

const app = require('./app');

const serverCofig = config.get('server');
app.listen(serverCofig.port);
