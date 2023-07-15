const { Model, DataTypes } = require('sequelize');

class ProductCategory extends Model {
  static init(sequelize) {
    super.init({
      productId: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
          model: 'product',
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
      modelName: 'productCategory',
      tableName: 'products_categories',
      underscored: true,
      timestamps: false
    });
  }

  static associate() {
    const Product = this.sequelize.models.product;
    const Category = this.sequelize.models.category;

    this.belongsTo(Product, { foreignKey: 'productId' });
    this.belongsTo(Category, { foreignKey: 'categoryName' });
  }
}

module.exports = ProductCategory;
