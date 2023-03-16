const crypto = require('crypto');

const { sequelize, Seller, Product, ProductCategory } = require('../models');

async function listProducts() {
  return await Product.findAll({
    attributes: {
      include: [
        [sequelize.col('seller.shop_name'), 'shopName'],
        [sequelize.fn('array_agg', sequelize.col('category_name')), 'categories']
      ],
      exclude: ['imageFilename']
    },
    include: [
      {
        model: Seller,
        attributes: []
      },
      {
        model: ProductCategory,
        attributes: []
      }
    ],
    group: ['product.id', 'shop_name'],
    raw: true,
    nest: true
  });
}

async function insertProduct(productData, sellerId) {
  const id = crypto.randomUUID();

  const productCategories = productData.categories.map((category) => {
    return { categoryName: category, productId: id };
  });

  await sequelize.transaction(async (t) => {
    await Product.create(
      {
        id,
        sellerId,
        productCategories,
        name: productData.name,
        brand: productData.brand,
        quantity: productData.quantity,
        price: productData.price
      },
      {
        transaction: t,
        include: {
          model: ProductCategory
        }
      }
    );
  });

  return id;
}

async function insertImage(filename, productId) {
  const result = await Product.update({ imageFilename: filename }, { where: { id: productId } });
  const affectedRows = result[0];

  return affectedRows > 0;
}

async function getProductById(productId) {
  return await Product.findByPk(productId, {
    attributes: {
      include: [
        [sequelize.col('shop_name'), 'shopName'],
        [sequelize.fn('array_agg', sequelize.col('category_name')), 'categories']
      ],
      exclude: ['imageFilename']
    },
    include: [
      {
        model: Seller,
        attributes: []
      },
      {
        model: ProductCategory,
        attributes: []
      }
    ],
    group: ['product.id', 'shop_name'],
    raw: true,
    nest: true
  });
}

async function getProductImageFilename(productId) {
  const product = await Product.findByPk(productId, {
    attributes: ['imageFilename'],
    raw: true
  });

  if (!product) {
    return null;
  }

  return product.imageFilename;
}

async function listSellerProducts(sellerId) {
  const products = await Product.findAll({
    where: {
      sellerId
    },
    attributes: {
      include: [
        [sequelize.col('shop_name'), 'shopName'],
        [sequelize.fn('array_agg', sequelize.col('category_name')), 'categories']
      ],
      exclude: ['imageFilename']
    },
    include: [
      {
        model: Seller,
        attributes: []
      },
      {
        model: ProductCategory,
        attributes: []
      }
    ],
    group: ['product.id', 'shop_name'],
    raw: true,
    nest: true
  });

  return products;
}

module.exports = {
  insertProduct,
  listProducts,
  getProductById,
  getProductImageFilename,
  listSellerProducts,
  insertImage
};
