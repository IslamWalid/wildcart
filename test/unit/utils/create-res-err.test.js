const crypto = require('crypto');

const bcrypt = require('bcrypt');

const createResErr = require('../../../src/utils/res-err-creator');
const { createUser } = require('../../../src/services/user');
const { createProduct } = require('../../../src/services/product');
const {
  sequelize,
  User,
  Seller,
  Product,
  ProductCategory
} = require('../../../src/models/');

beforeAll(async () => {
  const userId = crypto.randomUUID();
  const productId = crypto.randomUUID();
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('StrongPassword123!', salt);

  await User.create({
    id: userId,
    username: 'john_doe',
    firstName: 'John',
    lastName: 'Doe',
    password: hash,
    address: 'some address',
    phone: '+201012345678',
    userType: 'seller',
    seller: { id: userId, shopName: 'off market' }
  },
  {
    include: Seller
  });

  await Product.create({
    id: productId,
    sellerId: userId,
    name: 'shirt',
    brand: 'POLO',
    quantity: 5,
    price: 200,
    categories: [
      { productId, categoryName: 'clothes' },
      { productId, categoryName: 'men fashion' }
    ]
  },
  {
    include: ProductCategory
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
  await sequelize.close();
});
