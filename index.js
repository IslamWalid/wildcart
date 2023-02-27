require('dotenv').config();
require('./src/utils/check-env')();

const app = require('./app');
const config = require('config');

const serverCofig = config.get('server');
app.listen(serverCofig.port);
