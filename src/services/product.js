const crypto = require('crypto');
const { sequelize, Product, ProductCategory } = require('../models');

async function listProducts() {
  return await Product.findAll({ attributes: { exclude: ['image'] } });
}

async function insertProduct(productData, sellerId) {
  const id = crypto.randomUUID();

  const categories = productData.categories.map((category) => {
    return { categoryName: category, productId: id };
  });

  await sequelize.transaction(async (t) => {
    await Product.create({
      id,
      sellerId,
      categories,
      name: productData.name,
      brand: productData.brand,
      quantity: productData.quantity,
      price: productData.price
    },
    {
      transaction: t,
      include: {
        model: ProductCategory,
        as: 'categories'
      }
    });
  });
}

module.exports = {
  listProducts,
  insertProduct
};
