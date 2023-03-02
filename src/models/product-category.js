const { Model, DataTypes } = require('sequelize');

class ProductCategory extends Model {
  static init(sequelize) {
    super.init({
      productId: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
          model: 'Product',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      categoryName: {
        type: DataTypes.STRING,
        primaryKey: true,
        references: {
          model: 'Category',
          key: 'name'
        },
        onDelete: 'CASCADE'
      }
    },
    {
      sequelize,
      tableName: 'product_category',
      underscored: true,
      timestamps: false
    });
  }

  static associate() {
    const Product = this.sequelize.models.Product;
    const Category = this.sequelize.models.Category;

    this.belongsTo(Product, { foreignKey: 'productId', as: 'categories' });
    this.belongsTo(Category, { foreignKey: 'categoryName' });
  }
}

module.exports = ProductCategory;
