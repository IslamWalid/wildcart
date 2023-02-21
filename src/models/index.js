const fs = require('fs');
const path = require('path');
const config = require('config');
const { Sequelize } = require('sequelize');

const db = {};
const basename = path.basename(__filename);

const sequelize = new Sequelize(config.get('dbConfig'));

fs
  .readdirSync(__dirname)
  .filter((file) => (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js' &&
    file.indexOf('.test.js') === -1
  ))
  .map((file) => {
    const model = require(path.join(__dirname, file));
    model.init();
    db[model.name] = model;

    return model;
  })
  .forEach((model) => {
    if (model.associate) {
      model.associate();
    }
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
