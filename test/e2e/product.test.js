require('dotenv').config();
require('../../src/utils/check-env')();

const { sequelize, User, Category, Product } = require('../../src/models/');
const { createUser } = require('../../src/services/user');
const { createProduct } = require('../../src/services/product');
const { Roles } = require('../../src/utils/enums');
const { generateMultiple, generateProduct, generateCategory, generateUser } = require('../fixtures');

describe('product endpoints', () => {
  let seller, categories, products;

  beforeAll(async () => {
    seller = generateUser({ role: Roles.SELLER });
    await createUser(seller);
    const _seller = await User.findOne({
      attributes: ['id'],
      where: { username: seller.username },
      raw: true
    });
    seller.id = _seller.id;

    categories = generateMultiple(generateCategory, 3);
    await Category.bulkCreate(categories);

    products = generateMultiple(generateProduct, 10, {
      sellerId: seller.id,
      categories: categories.map((_) => _.name)
    });
    await Promise.all(products.map((_) => createProduct(_, seller.id)));
  });

  describe('get products', () => {
    it.todo('should return the available products with status code 200');
    it.todo('should return a specific number of products specified in limit query param with status code 200');
  });

  describe('get seller products', () => {
    it.todo('should return the available products of specific seller with status code 200');
  });

  describe('get product', () => {
    it.todo('should return product details with its id and status code 200');
    it.todo('should return null with status code 404 for non-existing id');
  });

  describe('post product', () => {
    it.todo('should create new product and return status code 200 with product id');
    it.todo('should return status code 400 for invalid categories');
    it.todo('should return status code 401 for unauthorized users');
    it.todo('should return status code 409 for same product name for the same seller');
  });

  describe('patch product', () => {
    it.todo('should update product with status code 200');
    it.todo('should return status code 401 for unauthorized users');
    it.todo('should return status code 404 for non-existing product id');
  });

  afterAll(async () => {
    await Product.destroy({ where: { sellerId: seller.id } });
    await Category.destroy({ where: { name: categories.map((_) => _.name) } });
    await User.destroy({ where: { id: seller.id } });
    await sequelize.close();
  });
});
