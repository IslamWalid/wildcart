require('dotenv').config();
require('../../src/utils/check-env')();

const { sequelize } = require('../../src/models/');

describe('product endpoints', () => {
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
    await sequelize.close();
  });
});
