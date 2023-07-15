const { Model, DataTypes } = require('sequelize');

class Category extends Model {
  static init(sequelize) {
    super.init({
      name: {
        type: DataTypes.STRING,
        primaryKey: true
      }
    },
    {
      sequelize,
      modelName: 'category',
      tableName: 'categories',
      underscored: true,
      timestamps: false
    });
  }

  static associate() {
    const ProductCategory = this.sequelize.models.productCategory;

    this.hasMany(ProductCategory, { foreignKey: 'categoryName' });
  }
}

module.exports = Category;
