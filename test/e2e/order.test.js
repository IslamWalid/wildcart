require('dotenv').config();
require('../../src/utils/check-env')();

const req = require('supertest');

const app = require('../../app');
const { sequelize, User, Product, Order, Category } = require('../../src/models');
const { createProduct } = require('../../src/services/product');
const { createUser } = require('../../src/services/user');
const { Roles, HttpStatus, Messages, OrderStatus } = require('../../src/utils/enums');
const { generateUser, generateProduct, generateCategory, generateMultiple, generateOrder } = require('../fixtures');
const { createOrder } = require('../../src/services/order');

function expectOrder(order) {
  expect(order).toHaveProperty('id');
  expect(order).toHaveProperty('customerId');
  expect(order).toHaveProperty('productId');
  expect(order).toHaveProperty('status');
  expect(order).toHaveProperty('quantity');
  expect(order).toHaveProperty('arrivalDate');
}

describe('order endpoints', () => {
  const uri = '/orders';
  let customer, customerCookie, seller, sellerCookie, product, categories, order;

  beforeAll(async () => {
    for (const isSeller of [true, false]) {
      const user = generateUser({ role: isSeller ? Roles.SELLER : Roles.CUSTOMER });
      await createUser(user);
      const _user = await User.findOne({
        attributes: ['id'],
        where: { username: user.username },
        raw: true
      });
      user.id = _user.id;

      const res = await req(app)
        .post('/users/login')
        .send({
          username: user.username,
          password: user.password
        });
      const cookie = res.header['set-cookie'].pop();

      if (isSeller) {
        seller = user;
        sellerCookie = cookie;
      } else {
        customer = user;
        customerCookie = cookie;
      }
    }

    categories = generateMultiple(generateCategory, 3);
    await Category.bulkCreate(categories);

    product = generateProduct({
      sellerId: seller.id,
      categories: categories.map((_) => _.name)
    });
    product.id = await createProduct(product, seller.id);

    await createOrder(customer.id, await Product.findByPk(product.id), 1);
    order = await Order.findOne();
  });

  describe('get orders', () => {
    it('should return customer orders with status code 200', async () => {
      const res = await req(app)
        .get(uri)
        .set({ cookie: customerCookie });

      expect(res.status).toBe(HttpStatus.OK);
      expect(Array.isArray(res.body.orders)).toBe(true);
      expect(res.body).toHaveProperty('next');
      expect(res.body).toHaveProperty('prev');
      expect(res.body).toHaveProperty('pageCount');
      expectOrder(res.body.orders[0]);
    });

    it('should return seller requested orders with status code 200', async () => {
      const res = await req(app)
        .get(uri)
        .set({ cookie: sellerCookie });

      expect(res.status).toBe(HttpStatus.OK);
      expect(Array.isArray(res.body.orders)).toBe(true);
      expect(res.body).toHaveProperty('next');
      expect(res.body).toHaveProperty('prev');
      expect(res.body).toHaveProperty('pageCount');
      expectOrder(res.body.orders[0]);
    });

    it('should return status code 401 for not loggedin user', async () => {
      const res = await req(app)
        .get(uri);

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body.message).toBe(Messages.UNAUTHORIZED);
    });
  });

  describe('patch order', () => {
    it('should make seller change order status with code status 200', async () => {
      const res = await req(app)
        .patch(`${uri}/${order.id}`)
        .set({ cookie: sellerCookie })
        .send({ status: OrderStatus.SHIPPED });

      expect(res.status).toBe(HttpStatus.OK);
    });

    it('should return status code 401 for unauthorized seller', async () => {
      const res = await req(app)
        .patch(`${uri}/${order.id}`)
        .send({ status: OrderStatus.SHIPPED });

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body.message).toBe(Messages.UNAUTHORIZED);
    });

    it('should return status code 404 for order non-exist or does not belong to the authorized seller', async () => {
      const res = await req(app)
        .patch(`${uri}/${generateOrder().id}`)
        .set({ cookie: sellerCookie })
        .send({ status: OrderStatus.SHIPPED });

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
      expect(res.body.message).toBe(Messages.NOT_FOUND);
    });
  });

  describe('post order', () => {
    it('should create product for customer with status code 201', async () => {
      const res = await req(app)
        .post(`${uri}/${product.id}`)
        .set({ cookie: customerCookie })
        .send({ quantity: 1 });

      expect(res.status).toBe(HttpStatus.CREATED);
      expect(res.body).toHaveProperty('clientSecret');
    });

    it('should return status code 401 for unauthorized customer', async () => {
      const res = await req(app)
        .post(`${uri}/${product.id}`)
        .send({ quantity: 1 });

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body.message).toBe(Messages.UNAUTHORIZED);
    });

    it('should return status code 409 for order quantity greater than the available', async () => {
      const res = await req(app)
        .post(`${uri}/${product.id}`)
        .set({ cookie: customerCookie })
        .send({ quantity: product.quantity + 10 });

      expect(res.status).toBe(HttpStatus.CONFLICT);
      expect(res.body.message).toBe(Messages.INVALID_QUANTITY);
    });
  });

  describe('delete order', () => {
    let shippedOrderId;

    beforeAll(async () => {
      const order = await Order.create(generateOrder({
        customerId: customer.id,
        productId: product.id,
        status: OrderStatus.SHIPPED
      }));

      shippedOrderId = order.id;
    });

    it('should return error with status code 401 for unauthorized customer', async () => {
      const res = await req(app)
        .delete(`${uri}/${order.id}`);

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body.message).toBe(Messages.UNAUTHORIZED);
    });

    it('should refuse to delete order in pending status with status code 409', async () => {
      const res = await req(app)
        .delete(`${uri}/${shippedOrderId}`)
        .set({ cookie: customerCookie });

      expect(res.status).toBe(HttpStatus.CONFLICT);
      expect(res.body.message).toBe(Messages.CANCEL_REFUSED);
    });
  });

  afterAll(async () => {
    await Order.destroy({ where: { productId: product.id } });
    await Product.destroy({ where: { sellerId: seller.id } });
    await Category.destroy({ where: { name: categories.map((_) => _.name) } });
    await User.destroy({ where: { id: [seller.id, customer.id] } });
    await sequelize.close();
  });
});
