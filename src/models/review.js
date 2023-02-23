const { Model, DataTypes } = require('sequelize');

class Review extends Model {
  static init(sequelize) {
    super.init({
      customerId: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
          model: 'Customer',
          key: 'userId'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      productId: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
          model: 'Product',
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      tableName: 'review',
      underscored: true,
      timestamps: true,
      createdAt: true,
      updatedAt: false
    });
  }

  static associate() {
    const Customer = this.sequelize.models.Customer;
    const Product = this.sequelize.models.Product;

    this.belongsTo(Customer, { foreignKey: 'customerId' });
    this.belongsTo(Product, { foreignKey: 'productId' });
  }
}

module.exports = Review;
