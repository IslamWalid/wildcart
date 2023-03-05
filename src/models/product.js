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
          model: 'seller',
          key: 'id'
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
      modelName: 'product',
      tableName: 'product',
      underscored: true,
      timestamps: false
    });
  }

  static associate() {
    const Seller = this.sequelize.models.seller;
    const Order = this.sequelize.models.order;
    const Review = this.sequelize.models.review;
    const ProductCategory = this.sequelize.models.productCategory;

    this.belongsTo(Seller, { foreignKey: 'sellerId' });
    this.hasMany(Order, { foreignKey: 'productId' });
    this.hasMany(Review, { foreignKey: 'productId' });
    this.hasMany(ProductCategory, { foreignKey: 'productId', as: 'categories' });
  }
}

module.exports = Product;
