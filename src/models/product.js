const { Model, DataTypes } = require('sequelize');

class Product extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      sellerId: {
        type: DataTypes.UUID,
        references: {
          model: 'Seller',
          key: 'userId'
        },
        allowNull: false,
        onDelete: 'CASCADE'
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      brand: {
        type: DataTypes.STRING,
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      image: {
        type: DataTypes.BLOB
      }
    },
    {
      sequelize,
      tableName: 'product',
      underscored: true,
      timestamps: false
    });
  }

  static associate() {
    const Seller = this.sequelize.models.Seller;
    const Order = this.sequelize.models.Order;
    const Review = this.sequelize.models.Review;
    const ProductCategory = this.sequelize.models.ProductCategory;

    this.belongsTo(Seller, { foreignKey: 'sellerId' });
    this.hasMany(Order, { foreignKey: 'productId' });
    this.hasMany(Review, { foreignKey: 'productId' });
    this.hasMany(ProductCategory, { foreignKey: 'productId' });
  }
}

module.exports = Product;
