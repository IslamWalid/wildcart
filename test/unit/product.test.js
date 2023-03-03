require('dotenv').config();
require('../../src/utils/check-env')();

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { sequelize, User, Seller } = require('../../src/models/');
const { insertProduct } = require('../../src/services/product');
const { ForeignKeyConstraintError, UniqueConstraintError } = require('sequelize');

const id = crypto.randomUUID();

beforeAll(async () => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('StrongPassword123!', salt);

  await User.create({
    id,
    username: 'john_doe',
    firstName: 'John',
    lastName: 'Doe',
    password: hash,
    address: 'some address',
    phone: '+201012345678',
    userType: 'seller',
    Seller: { userId: id, shopName: 'off market' }
  },
  {
    include: Seller
  });
});

describe('create product', () => {
  it('should create product with existing category', () => {
    const productData = {
      name: 'T-shirt',
      brand: 'POLO',
      quantity: 20,
      price: 100,
      categories: [
        'clothes',
        'men fashion'
      ]
    };
    expect(insertProduct(productData, id))
      .resolves
      .toBeUndefined();
  });

  it('should create product with the same seller with existing product name', () => {
    const productData = {
      name: 'T-shirt',
      brand: 'POLO',
      quantity: 20,
      price: 100,
      categories: [
        'clothes',
        'men fashion'
      ]
    };
    expect(insertProduct(productData, id))
      .rejects
      .toThrow(UniqueConstraintError);
  });

  it('should create product with non-existing category', () => {
    const productData = {
      name: 'shirt',
      brand: 'POLO',
      quantity: 20,
      price: 100,
      categories: [
        'non-existing category'
      ]
    };
    expect(insertProduct(productData, id))
      .rejects
      .toThrow(ForeignKeyConstraintError);
  });
});

afterAll(async () => {
  await sequelize.query('TRUNCATE TABLE "user" CASCADE');
  await sequelize.close();
});
