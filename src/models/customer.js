const { Model, DataTypes } = require('sequelize');

class Customer extends Model {
  static init(sequelize) {
    super.init({
      userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
          model: 'User',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      tableName: 'customer',
      underscored: true,
      timestamps: false
    });
  }

  static associate(models) {
    const User = this.sequelize.models.User;
    const Order = this.sequelize.models.Order;
    const Review = this.sequelize.models.Review;

    this.belongsTo(User, { foreignKey: 'userId' });
    this.hasMany(Order, { foreignKey: 'customerId' });
    this.hasMany(Review, { foreignKey: 'customerId' });
  }
}

module.exports = Customer;
