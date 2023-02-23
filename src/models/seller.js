const { Model, DataTypes } = require('sequelize');

class Seller extends Model {
  static init(sequelize) {
    super.init({
      userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
          model: 'User',
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
      tableName: 'seller',
      underscored: true,
      timestamps: false
    });
  }

  static associate(models) {
    const User = this.sequelize.models.User;
    const Product = this.sequelize.models.Product;

    this.belongsTo(User, { foreignKey: 'userId' });
    this.hasMany(Product, { foreignKey: 'sellerId' });
  }
}

module.exports = Seller;
