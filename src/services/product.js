const crypto = require('crypto');
const { Product, ProductCategory } = require('../models');

async function listProducts() {
  return await Product.findAll({ attributes: { exclude: ['image'] } });
}

async function insertProduct(productData, sellerId) {
  const id = crypto.randomUUID();

  productData.productCategories = productData.categories.map((category) => {
    return { categoryName: category, productId: id };
  });

  await Product.create({
    id,
    sellerId,
    ...productData
  },
  {
    include: ProductCategory
  });
}

module.exports = {
  listProducts,
  insertProduct
};
