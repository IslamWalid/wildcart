require('dotenv').config();
require('../../src/utils/check-env')();

const crypto = require('crypto');

const bcrypt = require('bcrypt');
const { ForeignKeyConstraintError, UniqueConstraintError } = require('sequelize');

const { sequelize, User, Seller, Product, ProductCategory } = require('../../src/models/');
const {
  createProduct,
  retrieveAllProducts,
  retrieveProductById,
  retrieveProductsBySellerId
} = require('../../src/services/product');

async function createTestUser() {
  const id = crypto.randomUUID();
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
    seller: { id, shopName: 'off market' }
  },
  {
    include: Seller
  });

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
}

async function bulkCreateTestProducts(sellerId) {
  const idOne = crypto.randomUUID();
  const idTwo = crypto.randomUUID();

  await Product.bulkCreate([
    {
      id: idOne,
      sellerId,
      name: 'shirt',
      brand: 'POLO',
      quantity: 20,
      price: 100,
      productCategories: [
        { productId: idOne, categoryName: 'clothes' },
        { productId: idOne, categoryName: 'men fashion' }
      ]
    },
    {
      id: idTwo,
      sellerId,
      name: 'T-shirt',
      brand: 'POLO',
      quantity: 20,
      price: 100,
      productCategories: [
        { productId: idTwo, categoryName: 'clothes' },
        { productId: idTwo, categoryName: 'men fashion' }
      ]
    }
  ],
  {
    include: ProductCategory
  });
}

describe('create product', () => {
  beforeEach(async () => {
    const sellerId = await createTestUser();
    await createTestProduct(sellerId);
  });

  it('should create product with existing category', async () => {
    const productData = {
      name: 'T-shirt',
      brand: 'POLO',
      quantity: 20,
      price: 100,
      categories: ['clothes', 'men fashion']
    };
    const user = await User.findOne({ where: { userType: 'seller' } });

    await expect(createProduct(productData, user.id))
      .resolves
      .not
      .toBeUndefined();
  });

  it('should create product with the same seller with existing product name', async () => {
    const productData = {
      name: 'shirt',
      brand: 'POLO',
      quantity: 20,
      price: 100,
      categories: ['clothes', 'men fashion']
    };
    const user = await User.findOne({ where: { userType: 'seller' } });

    await expect(createProduct(productData, user.id))
      .rejects
      .toThrow(UniqueConstraintError);
  });

  it('should create product with non-existing category', async () => {
    const productData = {
      name: 'T-shirt',
      brand: 'POLO',
      quantity: 20,
      price: 100,
      categories: ['non-existing category']
    };
    const user = await User.findOne({ where: { userType: 'seller' } });

    await expect(createProduct(productData, user.id))
      .rejects
      .toThrow(ForeignKeyConstraintError);
  });

  afterEach(async () => {
    await User.destroy({ where: { userType: 'seller' } });
  });
});

describe('retrieve products', () => {
  beforeAll(async () => {
    const sellerId = await createTestUser();
    await bulkCreateTestProducts(sellerId);
  });

  it('should list all products', async () => {
    const products = await retrieveAllProducts();

    products.forEach((product) => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('sellerId');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('quantity');
      expect(product).toHaveProperty('shopName');
      expect(product).toHaveProperty('categories');
    });
  });

  it('should get product by its it', async () => {
    const existingProduct = await Product.findOne();
    const product = await retrieveProductById(existingProduct.id);

    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('sellerId');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('quantity');
    expect(product).toHaveProperty('shopName');
    expect(product).toHaveProperty('categories');
  });

  it('should list seller products', async () => {
    const seller = await User.findOne();
    const products = await retrieveProductsBySellerId(seller.id);

    products.forEach((product) => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('sellerId');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('quantity');
      expect(product).toHaveProperty('shopName');
      expect(product).toHaveProperty('categories');
    });
  });

  afterAll(async () => {
    await User.destroy({ where: { userType: 'seller' } });
  });
});

afterAll(async () => {
  await sequelize.close();
});
