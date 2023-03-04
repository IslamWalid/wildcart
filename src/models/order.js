const { Model, DataTypes } = require('sequelize');

class Order extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      customerId: {
        type: DataTypes.UUID,
        references: {
          model: 'customer',
          key: 'userId'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      productId: {
        type: DataTypes.UUID,
        references: {
          model: 'Product',
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM,
        values: ['pending', 'shipped', 'arrived'],
        defaultValue: 'pending'
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      unitPrice: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      arrivalDate: {
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      modelName: 'order',
      tableName: 'order',
      underscored: true,
      timestamps: true,
      updatedAt: false,
      createdAt: 'orderDate'
    });
  }

  static associate() {
    const Customer = this.sequelize.models.customer;
    const Product = this.sequelize.models.product;

    this.belongsTo(Customer, { foreignKey: 'customerId' });
    this.belongsTo(Product, { foreignKey: 'productId' });
  }
}

module.exports = Order;
