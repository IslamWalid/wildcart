require('dotenv').config();
require('../../src/utils/check-env')();

const req = require('supertest');

const app = require('../../app');
const { sequelize, User, Category, Product } = require('../../src/models/');
const { createUser } = require('../../src/services/user');
const { createProduct } = require('../../src/services/product');
const { Roles, HttpStatus, Messages } = require('../../src/utils/enums');
const { generateMultiple, generateProduct, generateCategory, generateUser } = require('../fixtures');

function expectProduct(product) {
  expect(product).toHaveProperty('id');
  expect(product).toHaveProperty('name');
  expect(product).toHaveProperty('imageURL');
  expect(product).toHaveProperty('sellerId');
  expect(product).toHaveProperty('price');
  expect(product).toHaveProperty('quantity');
  expect(product).toHaveProperty('shopName');
  expect(product).toHaveProperty('avgRate');
  expect(product).toHaveProperty('categories');
}

describe('product endpoints', () => {
  const uri = '/products';
  let seller, cookie, categories, products;

  beforeAll(async () => {
    seller = generateUser({ role: Roles.SELLER });
    await createUser(seller);
    const _seller = await User.findOne({
      attributes: ['id'],
      where: { username: seller.username },
      raw: true
    });
    seller.id = _seller.id;

    const res = await req(app)
      .post('/users/login')
      .send({
        username: seller.username,
        password: seller.password
      });
    cookie = res.header['set-cookie'].pop();

    categories = generateMultiple(generateCategory, 3);
    await Category.bulkCreate(categories);

    products = generateMultiple(generateProduct, 10, {
      sellerId: seller.id,
      categories: categories.map((_) => _.name)
    });
    const ids = await Promise.all(products.map((_) => createProduct(_, seller.id)));
    ids.forEach((id, i) => {
      products[i].id = id;
    });
  });

  describe('get products', () => {
    it('should return the default limit of products with status code 200', async () => {
      const res = await req(app).get(uri);

      expect(res.status).toBe(HttpStatus.OK);
      expect(Array.isArray(res.body.products)).toBe(true);
      expect(res.body.products.length).toBe(4);
      expect(res.body).toHaveProperty('next');
      expect(res.body).toHaveProperty('prev');
      expect(res.body).toHaveProperty('pageCount');
      expectProduct(res.body.products[0]);
    });

    it('should return a specific number of products specified in limit query param with status code 200', async () => {
      const res = await req(app)
        .get(uri)
        .query({ limit: 1 });

      expect(res.status).toBe(HttpStatus.OK);
      expect(Array.isArray(res.body.products)).toBe(true);
      expect(res.body.products.length).toBe(1);
      expect(res.body).toHaveProperty('next');
      expect(res.body).toHaveProperty('prev');
      expect(res.body).toHaveProperty('pageCount');
      expectProduct(res.body.products[0]);
    });
  });

  describe('get seller products', () => {
    it('should return the available products of specific seller with status code 200', async () => {
      const res = await req(app)
        .get(`${uri}/sellers/${seller.id}`)
        .query({ limit: 1 });

      expect(res.status).toBe(HttpStatus.OK);
      expect(Array.isArray(res.body.products)).toBe(true);
      expect(res.body.products.length).toBe(1);
      expect(res.body).toHaveProperty('next');
      expect(res.body).toHaveProperty('prev');
      expect(res.body).toHaveProperty('pageCount');
      expectProduct(res.body.products[0]);
    });
  });

  describe('get product', () => {
    it('should return product details with its id and status code 200', async () => {
      const res = await req(app)
        .get(`${uri}/${products[0].id}`)
        .query({ limit: 1 });

      expect(res.status).toBe(HttpStatus.OK);
      expectProduct(res.body);
    });

    it('should return null with status code 404 for non-existing id', async () => {
      const nonExistingProduct = generateProduct();
      const res = await req(app)
        .get(`${uri}/${nonExistingProduct.id}`)
        .query({ limit: 1 });

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
      expect(res.body.message).toBe(Messages.NOT_FOUND);
    });
  });

  describe('post product', () => {
    let productId;

    it('should create new product and return status code 200 and product id', async () => {
      const product = generateProduct({ categories: categories.map((_) => _.name) });
      product.id = product.sellerId = product.avgRate = undefined;

      const res = await req(app)
        .post(uri)
        .set({ cookie })
        .send(product);

      expect(res.status).toBe(HttpStatus.CREATED);
      expect(res.body).toHaveProperty('id');
      productId = res.body.id;
    });

    it('should return status code 400 for invalid categories', async () => {
      const product = generateProduct();
      product.id = product.sellerId = product.avgRate = undefined;

      const res = await req(app)
        .post(uri)
        .set({ cookie })
        .send(product);

      expect(res.status).toBe(HttpStatus.BAD_REQUEST);
      expect(res.body.message).toBe(Messages.INVALID_CATEGORY);
    });

    it('should return status code 401 for unauthorized users', async () => {
      const product = generateProduct({ categories: categories.map((_) => _.name) });
      product.id = product.sellerId = product.avgRate = undefined;

      const res = await req(app)
        .post(uri)
        .send(product);

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body.message).toBe(Messages.UNAUTHORIZED);
    });

    it('should return status code 409 for same product name for the same seller', async () => {
      const product = generateProduct({ name: products[0].name });
      product.id = product.sellerId = product.avgRate = undefined;

      const res = await req(app)
        .post(uri)
        .set({ cookie })
        .send(product);

      expect(res.status).toBe(HttpStatus.CONFLICT);
      expect(res.body.message).toBe(Messages.PRODUCT_NAME_ALREADY_EXISTS);
    });

    afterAll(async () => {
      await Product.destroy({ where: { id: productId } });
    });
  });

  describe('patch product', () => {
    it('should update product with status code 200', async () => {
      const res = await req(app)
        .patch(`${uri}/${products[0].id}`)
        .set({ cookie })
        .send({ quantity: 3 });

      expect(res.status).toBe(HttpStatus.OK);
    });

    it('should return status code 401 for unauthorized users', async () => {
      const res = await req(app)
        .patch(`${uri}/${products[0].id}`)
        .send({ quantity: 3 });

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body.message).toBe(Messages.UNAUTHORIZED);
    });

    it('should return status code 404 for non-existing product id', async () => {
      const res = await req(app)
        .patch(`${uri}/${generateProduct().id}`)
        .set({ cookie })
        .send({ quantity: 3 });

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
      expect(res.body.message).toBe(Messages.NOT_FOUND);
    });
  });

  afterAll(async () => {
    await Product.destroy({ where: { sellerId: seller.id } });
    await Category.destroy({ where: { name: categories.map((_) => _.name) } });
    await User.destroy({ where: { id: seller.id } });
    await sequelize.close();
  });
});
