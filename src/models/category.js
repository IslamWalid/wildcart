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
      underscored: true,
      tableName: 'category',
      timestamps: false
    });
  }

  static associate() {
    const ProductCategory = this.sequelize.models.ProductCategory;

    this.hasMany(ProductCategory, { foreignKey: 'categoryName' });
  }
}

module.exports = Category;
