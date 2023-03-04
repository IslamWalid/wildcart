const { Model, DataTypes } = require('sequelize');

class Review extends Model {
  static init(sequelize) {
    super.init({
      customerId: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
          model: 'customer',
          key: 'userId'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      productId: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
          model: 'product',
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
      modelName: 'review',
      tableName: 'review',
      underscored: true,
      timestamps: true,
      createdAt: true,
      updatedAt: false
    });
  }

  static associate() {
    const Customer = this.sequelize.models.customer;
    const Product = this.sequelize.models.product;

    this.belongsTo(Customer, { foreignKey: 'customerId' });
    this.belongsTo(Product, { foreignKey: 'productId' });
  }
}

module.exports = Review;
