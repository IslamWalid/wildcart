const crypto = require('crypto');

const bcrypt = require('bcrypt');

const createResErr = require('../../../src/utils/res-err-creator');
const { createUser } = require('../../../src/services/user');
const { createProduct } = require('../../../src/services/product');
const {
  sequelize,
  User,
  Seller,
  Customer,
  Product,
  Review,
  ProductCategory
} = require('../../../src/models/');
const { createReview } = require('../../../src/services/review');

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
  await Review.create({
    customerId,
    productId,
    comment: 'review',
    rate: 5
  });
}

describe('register user errors', () => {
  beforeAll(async () => {
    await createTestUser({
      username: 'john_doe',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+201012345678',
      userType: 'seller'
    });
  });

  it('should get already existing username error info', async () => {
    try {
      await createUser({
        username: 'john_doe',
        firstName: 'John',
        lastName: 'Doe',
        password: 'StrongPassword123!',
        phone: '+201087654321',
        address: 'address',
        userType: 'customer'
      });
    } catch (err) {
      const { status, message, errInfo } = createResErr(err);

      expect(status).toBe(409);
      expect(message).toBe('username already exists');
      expect(errInfo.stack).not.toBeUndefined();
      expect(errInfo.message).toBe('Key (username)=(john_doe) already exists.');
      expect(errInfo.meta.table).toBe('user');
      expect(errInfo.meta.name).toBe('SequelizeUniqueConstraintError');
      expect(errInfo.meta.constraint).toBe('user_username_key');
    }
  });

  it('should get already existing phone error info', async () => {
    try {
      await createUser({
        username: 'john_lnu',
        firstName: 'Lnu',
        lastName: 'Doe',
        password: 'StrongPassword123!',
        phone: '+201012345678',
        address: 'address',
        userType: 'customer'
      });
    } catch (err) {
      const { status, message, errInfo } = createResErr(err);

      expect(status).toBe(409);
      expect(message).toBe('phone already exists');
      expect(errInfo.stack).not.toBeUndefined();
      expect(errInfo.message).toBe('Key (phone)=(+201012345678) already exists.');
      expect(errInfo.meta.table).toBe('user');
      expect(errInfo.meta.name).toBe('SequelizeUniqueConstraintError');
      expect(errInfo.meta.constraint).toBe('user_phone_key');
    }
  });

  it('should get wrong datatype error info', async () => {
    try {
      await createUser({
        username: 'john_lnu',
        firstName: 'John',
        lastName: 'Lnu',
        password: 'StrongPassword123!',
        phone: '+201087654321',
        address: 'address',
        userType: 'invalid enum value'
      });
    } catch (err) {
      const { status, message, errInfo } = createResErr(err);

      expect(status).toBe(400);
      expect(message).toBe('invalid input datatype');
      expect(errInfo.stack).not.toBeUndefined();
      expect(errInfo.message).toBe('invalid input value for enum enum_user_user_type: "invalid enum value"');
      expect(errInfo.meta.name).toBe('SequelizeDatabaseError');
      expect(errInfo.meta.constraint).toBe('22P02');
    }
  });

  afterAll(async () => {
    await sequelize.query('TRUNCATE TABLE "user" CASCADE');
  });
});

describe('create product errors', () => {
  beforeAll(async () => {
    const sellerId = await createTestUser({
      username: 'john_doe',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+201012345678',
      userType: 'seller'
    });

    await createTestProduct(sellerId);
  });

  it('should get invalid categories error info', async () => {
    const productData = {
      name: 'T-shirt',
      brand: 'POLO',
      quantity: 20,
      price: 100,
      categories: ['non-existing category']
    };
    const user = await User.findOne({ where: { userType: 'seller' } });

    try {
      await createProduct(productData, user.id);
    } catch (err) {
      const { status, message, errInfo } = createResErr(err);

      expect(status).toBe(400);
      expect(message).toBe('invalid categories');
      expect(errInfo.stack).not.toBeUndefined();
      expect(errInfo.message).toBe('Key (category_name)=(non-existing category) is not present in table "category".');
      expect(errInfo.meta.table).toBe('product_category');
      expect(errInfo.meta.name).toBe('SequelizeForeignKeyConstraintError');
      expect(errInfo.meta.constraint).toBe('product_category_category_name_fkey');
    }
  });

  it('should get already existing product name for the same seller error info', async () => {
    const productData = {
      name: 'shirt',
      brand: 'POLO',
      quantity: 20,
      price: 100,
      categories: ['clothes']
    };
    const user = await User.findOne({ where: { userType: 'seller' } });

    try {
      await createProduct(productData, user.id);
    } catch (err) {
      const { status, message, errInfo } = createResErr(err);

      expect(status).toBe(409);
      expect(message).toBe('product name already exists for this seller');
      expect(errInfo.stack).not.toBeUndefined();
      expect(errInfo.message).toContain('Key (name, seller_id)');
      expect(errInfo.meta.table).toBe('product');
      expect(errInfo.meta.name).toBe('SequelizeUniqueConstraintError');
      expect(errInfo.meta.constraint).toBe('product_name_seller_id_unique_constraint');
    }
  });

  afterAll(async () => {
    await sequelize.query('TRUNCATE TABLE "user" CASCADE');
  });
});

describe('create review errors', () => {
  beforeAll(async () => {
    const sellerId = await createTestUser({
      username: 'john_doe',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+201012345678',
      userType: 'seller'
    });

    const customerId = await createTestUser({
      username: 'jane_doe',
      firstName: 'Jane',
      lastName: 'Doe',
      phone: '+201087654321',
      userType: 'customer'
    });

    const productId = await createTestProduct(sellerId);

    await createTestReview(customerId, productId);
  });

  it('should get review to a non-existing product error info', async () => {
    const nonExistingId = crypto.randomUUID();
    const customer = await User.findOne({ where: { userType: 'customer' } });

    try {
      await createReview(customer.id, nonExistingId, {
        comment: 'good review',
        rate: 5
      });
    } catch (err) {
      const { status, message, errInfo } = createResErr(err);

      expect(status).toBe(404);
      expect(message).toBe('product not found');
      expect(errInfo.stack).not.toBeUndefined();
      expect(errInfo.message).toBe(`Key (product_id)=(${nonExistingId}) is not present in table "product".`);
      expect(errInfo.meta.table).toBe('review');
      expect(errInfo.meta.name).toBe('SequelizeForeignKeyConstraintError');
      expect(errInfo.meta.constraint).toBe('review_product_id_fkey');
    }
  });

  it('should get customer already reviewed this product error info', async () => {
    const product = await Product.findOne();
    const customer = await User.findOne({ where: { userType: 'customer' } });

    try {
      await createReview(customer.id, product.id, {
        comment: 'good review',
        rate: 5
      });
    } catch (err) {
      const { status, message, errInfo } = createResErr(err);

      expect(status).toBe(409);
      expect(message).toBe('user have already reviewed this product');
      expect(errInfo.stack).not.toBeUndefined();
      expect(errInfo.message).toBe(`Key (customer_id, product_id)=(${customer.id}, ${product.id}) already exists.`);
      expect(errInfo.meta.table).toBe('review');
      expect(errInfo.meta.name).toBe('SequelizeUniqueConstraintError');
      expect(errInfo.meta.constraint).toBe('review_pkey');
    }
  });

  afterAll(async () => {
    await sequelize.query('TRUNCATE TABLE "user" CASCADE');
  });
});

afterAll(async () => {
  await sequelize.close();
});
