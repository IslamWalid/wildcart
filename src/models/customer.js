const { Model, DataTypes } = require('sequelize');

class Customer extends Model {
  static init(sequelize) {
    super.init({
      userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
          model: 'user',
          key: 'id'
        }
      }
    },
    {
      sequelize,
      modelName: 'customer',
      tableName: 'customer',
      underscored: true,
      timestamps: false
    });
  }

  static associate(models) {
    const User = this.sequelize.models.user;
    const Order = this.sequelize.models.order;
    const Review = this.sequelize.models.review;

    this.belongsTo(User, { foreignKey: 'userId' });
    this.hasMany(Order, { foreignKey: 'customerId' });
    this.hasMany(Review, { foreignKey: 'customerId' });
  }
}

module.exports = Customer;
