const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');

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

async function retrieveAllProducts() {
  return await Product.findAll({
    attributes: {
      include: [
        [sequelize.col('seller.shop_name'), 'shopName'],
        [sequelize.fn('array_agg', sequelize.literal('DISTINCT "category_name"')), 'categories'],
        [sequelize.cast(
          sequelize.fn('coalesce', sequelize.fn('avg', sequelize.col('rate')), 0),
          'NUMERIC(3, 2)'),
        'avgRate']
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
    raw: true,
    nest: true
  });
}

async function retrieveProduct(productId) {
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
  const { name, brand, quantity, price } = product;

  const result = await Product.update({ name, brand, quantity, price }, {
    where: {
      sellerId,
      id: productId
    }
  });

  return result[0] > 0;
}

async function retrieveSellerProducts(sellerId) {
  const products = await Product.findAll({
    where: {
      sellerId
    },
    attributes: {
      include: [
        [sequelize.col('shop_name'), 'shopName'],
        [sequelize.fn('array_agg', sequelize.literal('DISTINCT "category_name"')), 'categories'],
        [sequelize.cast(
          sequelize.fn('coalesce', sequelize.fn('avg', sequelize.col('rate')), 0),
          'NUMERIC(3, 2)'),
        'avgRate']
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
      },
      {
        model: Review,
        attributes: []
      }
    ],
    group: ['product.id', 'shop_name'],
    raw: true,
    nest: true
  });

  return products;
}

async function retrieveProductImageFilename(productId) {
  const product = await Product.findByPk(productId, {
    attributes: ['imageFilename'],
    raw: true
  });

  if (!product) {
    return null;
  }

  return product.imageFilename;
}

async function updateProductImage(filename, productId) {
  const product = await Product.findByPk(productId);
  if (!product) {
    return null;
  }

  if (product.imageFilename) {
    await fs.unlink(path.join(__dirname, '../../media/') + product.imageFilename);
  }

  product.imageFilename = filename;

  return await product.save();
}

module.exports = {
  createProduct,
  retrieveAllProducts,
  retrieveProduct,
  updateProduct,
  retrieveSellerProducts,
  retrieveProductImageFilename,
  updateProductImage
};
