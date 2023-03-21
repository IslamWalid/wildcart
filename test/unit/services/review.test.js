const crypto = require('crypto');

const bcrypt = require('bcrypt');
const { ForeignKeyConstraintError, UniqueConstraintError } = require('sequelize');

const { createReview } = require('../../../src/services/review');
const {
  sequelize,
  User,
  Customer,
  Seller,
  Product,
  Review,
  ProductCategory
} = require('../../../src/models/');

async function createTestUser(userData) {
  const id = crypto.randomUUID();
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('StrongPassword123!', salt);

  userData.id = id;
  userData.password = hash;
  userData.address = 'some address';

  if (userData.userType === 'customer') {
    userData.customer = { id };
    await User.create(userData, { include: Customer });
  } else {
    userData.seller = { id, shopName: 'off market' };
    await User.create(userData, { include: Seller });
  }

  return id;
}

async function createTestProduct(sellerId) {
  const id = crypto.randomUUID();

  await Product.create({
    id,
    sellerId,
    name: 'shirt',
    brand: 'POLO',
    quantity: 20,
    price: 100,
    productCategories: [
      { productId: id, categoryName: 'clothes' },
      { productId: id, categoryName: 'men fashion' }
    ]
  },
  {
    include: ProductCategory
  });

  return id;
}

async function createTestReview(customerId, productId) {
  const product = await Product.findOne();
  const customer = await User.findOne({ where: { username: 'john_doe' } });

  await Review.create({
    productId: product.id,
    customerId: customer.id,
    rate: 4,
    comment: 'product review'
  });
}

beforeAll(async () => {
  const sellerId = await createTestUser({
    username: 'john_lnu',
    firstName: 'John',
    lastName: 'Lnu',
    phone: '+201012345678',
    userType: 'seller'
  });

  await createTestUser({
    username: 'john_doe',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+201087654321',
    userType: 'customer'
  });

  await createTestUser({
    username: 'jane_dao',
    firstName: 'Jane',
    lastName: 'Doe',
    phone: '+201098765432',
    userType: 'customer'
  });

  await createTestProduct(sellerId);
});

describe('create review', () => {
  it('should create review to an existing product', async () => {
    const product = await Product.findOne();
    const customer = await User.findOne({ where: { username: 'jane_dao' } });

    await expect(createReview(customer.id, product.id, {
      rate: 4,
      comment: 'review comment'
    }))
      .resolves
      .toBeUndefined();
  });

  it('should create review to a non-existing product', async () => {
    const nonExistingId = crypto.randomUUID();
    const customer = await User.findOne({ where: { username: 'jane_dao' } });

    await expect(createReview(customer.id, nonExistingId, {
      rate: 4,
      comment: 'review comment'
    }))
      .rejects
      .toThrow(ForeignKeyConstraintError);
  });

  it('should create review with a user that have already reviewed the product', async () => {
    const product = await Product.findOne();
    const customer = await User.findOne({ where: { username: 'jane_dao' } });

    await createTestReview(customer.id, product.id);

    await expect(createReview(customer.id, product.id, {
      rate: 4,
      comment: 'review comment'
    }))
      .rejects
      .toThrow(UniqueConstraintError);
  });

  afterAll(async () => {
    await Review.destroy({ truncate: true });
  });
});

afterAll(async () => {
  await sequelize.query('TRUNCATE TABLE "user" CASCADE');
  await sequelize.close();
});
