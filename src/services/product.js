const crypto = require('crypto');
const { sequelize, User, Seller, Product, ProductCategory } = require('../models');

async function listProducts() {
  return await Product.findAll({
    attributes: {
      include: [
        [sequelize.col('seller.shop_name'), 'shopName'],
        [sequelize.fn('array_agg', sequelize.col('category_name')), 'categories']
      ],
      exclude: ['image']
    },
    include: [
      {
        model: Seller,
        required: true,
        attributes: []
      },
      {
        model: ProductCategory,
        required: true,
        attributes: []
      }
    ],
    group: ['product.id', 'shop_name']
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
}

async function getProductById(productId) {
  return await Product.findByPk(productId, {
    attributes: {
      include: [
        [sequelize.fn('array_agg', sequelize.col('category_name')), 'categories']
      ],
      exclude: ['sellerId', 'image']
    },
    include: [
      {
        model: Seller,
        required: true,
        attributes: [
          'id',
          'shopName',
          [sequelize.literal('"seller->user"."username"'), 'username'],
          [sequelize.literal('"seller->user"."first_name"'), 'firstName'],
          [sequelize.literal('"seller->user"."last_name"'), 'lastName'],
          [sequelize.literal('"seller->user"."phone"'), 'phone']
        ],
        include: {
          model: User,
          attributes: []
        }
      },
      {
        model: ProductCategory,
        required: true,
        attributes: []
      }
    ],
    group: [
      'seller.id',
      'seller->user.username',
      'seller->user.first_name',
      'seller->user.last_name',
      'seller->user.phone',
      'product.id',
      'shop_name'
    ]
  });
}

async function listSellerProducts(sellerId) {
  const seller = await User.findByPk(sellerId, {
    attributes: {
      include: [
        [sequelize.col('shop_name'), 'shopName']
      ],
      exclude: ['id', 'userType', 'password', 'phone', 'address']
    },
    include: {
      model: Seller,
      required: true,
      attributes: []
    }
  });

  const products = await Product.findAll({
    where: {
      sellerId
    },
    attributes: {
      include: [[sequelize.fn('array_agg', sequelize.col('category_name')), 'categories']],
      exclude: ['sellerId', 'image']
    },
    include: {
      model: ProductCategory,
      required: true,
      attributes: []
    },
    group: ['id']
  });

  return { seller, products };
}

module.exports = {
  insertProduct,
  listProducts,
  getProductById,
  listSellerProducts
};
