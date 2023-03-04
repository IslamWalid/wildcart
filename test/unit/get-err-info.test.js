const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { createUser } = require('../../src/services/user');
const { insertProduct } = require('../../src/services/product');
const { sequelize, User, Seller, Product } = require('../../src/models/');
const createResErr = require('../../src/utils/get-err-info');

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
    Seller: { userId, shopName: 'off market' }
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
    const resErr = createResErr(err);

    expect(resErr.status).toBe(409);
    expect(resErr.message).toBe('username already exists');
    expect(resErr.errInfo.table).toBe('user');
    expect(resErr.errInfo.name).toBe('SequelizeUniqueConstraintError');
    expect(resErr.errInfo.constraint).toBe('user_username_key');
    expect(resErr.errInfo.message).toBe('Key (username)=(john_doe) already exists.');
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
    const resErr = createResErr(err);

    expect(resErr.status).toBe(409);
    expect(resErr.message).toBe('phone already exists');
    expect(resErr.errInfo.table).toBe('user');
    expect(resErr.errInfo.name).toBe('SequelizeUniqueConstraintError');
    expect(resErr.errInfo.constraint).toBe('user_phone_key');
    expect(resErr.errInfo.message).toBe('Key (phone)=(+201012345678) already exists.');
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
    const resErr = createResErr(err);

    expect(resErr.status).toBe(400);
    expect(resErr.message).toBe('invalid input datatype');
    expect(resErr.errInfo.name).toBe('SequelizeDatabaseError');
    expect(resErr.errInfo.constraint).toBe('22P02');
    expect(resErr.errInfo.message).toBe('invalid input value for enum enum_user_user_type: "invalid enum value"');
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
    await insertProduct(productData, user.id);
  } catch (err) {
    const resErr = createResErr(err);

    expect(resErr.status).toBe(400);
    expect(resErr.message).toBe('invalid categories');
    expect(resErr.errInfo.table).toBe('product_category');
    expect(resErr.errInfo.name).toBe('SequelizeForeignKeyConstraintError');
    expect(resErr.errInfo.constraint).toBe('product_category_category_name_fkey');
    expect(resErr.errInfo.message).toBe('Key (category_name)=(non-existing category) is not present in table "category".');
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
    await insertProduct(productData, user.id);
  } catch (err) {
    const resErr = createResErr(err);

    expect(resErr.status).toBe(409);
    expect(resErr.message).toBe('product name already exists for this seller');
    expect(resErr.errInfo.table).toBe('product');
    expect(resErr.errInfo.name).toBe('SequelizeUniqueConstraintError');
    expect(resErr.errInfo.constraint).toBe('product_name_seller_id_unique_constraint');
  }
});

afterAll(async () => {
  await sequelize.query('TRUNCATE TABLE "user" CASCADE');
  await sequelize.close();
});
