const { Model, DataTypes } = require('sequelize');

class Session extends Model {
  static init(sequelize) {
    super.init({
      sid: {
        type: DataTypes.STRING,
        primaryKey: true
      },
      expires: DataTypes.DATE,
      data: DataTypes.STRING
    },
    {
      sequelize,
      tableName: 'session',
      underscored: true,
      timestamps: false
    });
  }
}

module.exports = Session;
