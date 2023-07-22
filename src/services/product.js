const crypto = require('crypto');

const { sequelize, Seller, Product, Review, ProductCategory } = require('../models');

const productAttributes = [
  'id',
  'name',
  'imageURL',
  'sellerId',
  [sequelize.col('seller.shop_name'), 'shopName'],
  [sequelize.fn('COALESCE', sequelize.fn('AVG', sequelize.col('rate')), 0), 'avgRate'],
  [sequelize.fn('array_agg', sequelize.literal('DISTINCT "category_name"')), 'categories']
];

async function createProduct(productData, sellerId) {
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

async function retrieveAllProducts(skip, limit) {
  const { rows, count } = await Product.findAndCountAll({
    attributes: productAttributes,
    include: [
      {
        model: Seller,
        attributes: []
      },
      {
        model: Review,
        attributes: []
      },
      {
        model: ProductCategory,
        attributes: []
      }
    ],
    group: ['product.id', 'seller.shop_name'],
    subQuery: false,
    offset: skip,
    limit,
    raw: true,
    nest: true
  });

  return {
    products: rows,
    pageCount: Math.ceil(count.length / limit)
  };
}

async function retrieveProduct(productId) {
  return await Product.findByPk(productId, {
    attributes: productAttributes,
    include: [
      {
        model: Seller,
        attributes: []
      },
      {
        model: ProductCategory,
        attributes: []
      },
      {
        model: Review,
        attributes: []
      }
    ],
    group: [
      'product.id',
      'shop_name'
    ]
  });
}

async function updateProduct(sellerId, productId, product) {
  const result = await Product.update(product, {
    where: { sellerId, id: productId },
    fields: ['name', 'brand', 'quantity', 'price']
  });

  return result[0] > 0;
}

async function retrieveSellerProducts(sellerId, skip, limit) {
  const { rows, count } = await Product.findAndCountAll({
    where: { sellerId },
    attributes: productAttributes,
    include: [
      {
        model: Seller,
        attributes: []
      },
      {
        model: ProductCategory,
        attributes: []
      },
      {
        model: Review,
        attributes: []
      }
    ],
    group: ['product.id', 'seller.id'],
    subQuery: false,
    offset: skip,
    limit
  });

  return {
    products: rows,
    pageCount: Math.ceil(count.length / limit)
  };
}

async function updateProductImage(sellerId, productId, imageURL) {
  const result = await Product.update({ imageURL }, {
    where: { sellerId, id: productId }
  });

  return result[0] > 0;
}

module.exports = {
  createProduct,
  retrieveAllProducts,
  retrieveProduct,
  updateProduct,
  retrieveSellerProducts,
  updateProductImage
};
