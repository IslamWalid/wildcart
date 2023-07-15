const crypto = require('crypto');

const { sequelize, Seller, Product, Review, ProductCategory } = require('../models');

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
    attributes: {
      include: [
        'imageURL',
        [sequelize.col('seller.shop_name'), 'shopName'],
        [sequelize.fn('array_agg', sequelize.literal('DISTINCT "category_name"')), 'categories'],
        [
          sequelize.cast(
            sequelize.fn('coalesce', sequelize.fn('avg', sequelize.col('rate')), 0),
            'NUMERIC(3, 2)'),
          'avgRate'
        ]
      ]
    },
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
    ],
    offset: skip,
    limit,
    raw: true,
    nest: true
  });

  return {
    products: rows,
    pageCount: Math.ceil(count / limit)
  };
}

async function retrieveProduct(productId) {
  return await Product.findByPk(productId, {
    attributes: {
      include: [
        'imageURL',
        [sequelize.col('shop_name'), 'shopName'],
        [sequelize.fn('array_agg', sequelize.col('category_name')), 'categories']
      ]
    },
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
        attributes: ['rate', 'comment', 'createdAt']
      }
    ],
    group: [
      'product.id',
      'shop_name',
      'reviews.product_id',
      'reviews.customer_id'
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
    attributes: [
      'imageURL',
      [sequelize.literal('seller.shop_name'), 'shopName'],
      [sequelize.fn('array_agg', sequelize.literal('DISTINCT "category_name"')), 'categories'],
      [
        sequelize.cast(
          sequelize.fn('coalesce', sequelize.fn('avg', sequelize.col('rate')), 0),
          'NUMERIC(3, 2)'),
        'avgRate'
      ]
    ],
    include: [
      {
        model: ProductCategory,
        attributes: []
      },
      {
        model: Review,
        attributes: []
      }
    ],
    offset: skip,
    limit,
    group: ['seller.id', 'products.id']
  });

  return {
    products: rows,
    pageCount: Math.ceil(count / limit)
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
