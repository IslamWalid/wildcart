const { Model, DataTypes } = require('sequelize');

class Seller extends Model {
  static init(sequelize) {
    super.init({
      userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
          model: 'user',
          key: 'id'
        }
      },
      shopName: {
        type: DataTypes.STRING,
        allownull: false
      }
    },
    {
      sequelize,
      modelName: 'seller',
      tableName: 'seller',
      underscored: true,
      timestamps: false
    });
  }

  static associate(models) {
    const User = this.sequelize.models.user;
    const Product = this.sequelize.models.product;

    this.belongsTo(User, { foreignKey: 'userId' });
    this.hasMany(Product, { foreignKey: 'sellerId' });
  }
}

module.exports = Seller;
