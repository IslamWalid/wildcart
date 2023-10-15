const req = require('supertest');

const app = require('../../app');
const { Roles, HttpStatus, Messages } = require('../../src/utils/enums');
const { createUser } = require('../../src/services/user');
const { createProduct } = require('../../src/services/product');
const { sequelize, User, Category, Product } = require('../../src/models');
const { generateUser, generateMultiple, generateCategory, generateProduct, generateReview } = require('../fixtures');
const { createReview } = require('../../src/services/review');

describe('review endpoints', () => {
  const uri = '/reviews';
  let customerWithoutReview, customerWithReview, seller, product;

  beforeAll(async () => {
    const users = [];

    for (let i = 0; i < 3; i++) {
      const user = generateUser({ role: i === 0 ? Roles.SELLER : Roles.CUSTOMER });
      await createUser(user);
      const _user = await User.findOne({
        attributes: ['id'],
        where: { username: user.username },
        raw: true
      });
      user.id = _user.id;

      if (user.role === Roles.CUSTOMER) {
        const res = await req(app)
          .post('/users/login')
          .send({
            username: user.username,
            password: user.password
          });
        user.cookie = res.header['set-cookie'].pop();
      }
      users.push(user);
    }
    [seller, customerWithReview, customerWithoutReview] = users;

    const categories = generateMultiple(generateCategory, 3);
    await Category.bulkCreate(categories);

    product = generateProduct({
      sellerId: seller.id,
      categories: categories.map((_) => _.name)
    });
    product.id = await createProduct(product, seller.id);

    const review = generateReview({
      customerId: customerWithReview.id,
      productId: product.id
    });
    await createReview(customerWithReview.id, product.id, review);
  });

  describe('get product reviews', () => {
    it('should get all reviews on product by product id with status code 200', async () => {
      const res = await req(app)
        .get(`${uri}/${product.id}`);

      expect(res.status).toBe(HttpStatus.OK);
      expect(Array.isArray(res.body.reviews)).toBe(true);
      expect(res.body.reviews[0]).toHaveProperty('customerId');
      expect(res.body.reviews[0]).toHaveProperty('rate');
      expect(res.body.reviews[0]).toHaveProperty('comment');
      expect(res.body.reviews[0]).toHaveProperty('createdAt');
      expect(res.body).toHaveProperty('next');
      expect(res.body).toHaveProperty('prev');
      expect(res.body).toHaveProperty('pageCount');
    });
  });

  describe('post review', () => {
    it('should create review and return status code 201', async () => {
      const review = generateReview();

      const res = await req(app)
        .post(`${uri}/${product.id}`)
        .set({ cookie: customerWithoutReview.cookie })
        .send({
          rate: review.rate,
          comment: review.comment
        });

      expect(res.status).toBe(HttpStatus.CREATED);
    });

    it('should reject with status code 401 for not logged in customer', async () => {
      const review = generateReview();

      const res = await req(app)
        .post(`${uri}/${product.id}`)
        .send({
          rate: review.rate,
          comment: review.comment
        });

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body.message).toBe(Messages.UNAUTHORIZED);
    });

    it('should reject with status code 409 if customer has already reviewed the product', async () => {
      const review = generateReview();

      const res = await req(app)
        .post(`${uri}/${product.id}`)
        .set({ cookie: customerWithReview.cookie })
        .send({
          rate: review.rate,
          comment: review.comment
        });

      expect(res.status).toBe(HttpStatus.CONFLICT);
      expect(res.body.message).toBe(Messages.REVIEW_ALREADY_EXISTS);
    });
  });

  describe('patch review', () => {
    it('should update review and return status code 200', async () => {
      const review = generateReview();

      const res = await req(app)
        .patch(`${uri}/${product.id}`)
        .set({ cookie: customerWithReview.cookie })
        .send({
          comment: review.comment
        });

      expect(res.status).toBe(HttpStatus.OK);
    });

    it('should return status code 401 for not logged in customer', async () => {
      const review = generateReview();

      const res = await req(app)
        .patch(`${uri}/${product.id}`)
        .send({
          rate: review.rate
        });

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body.message).toBe(Messages.UNAUTHORIZED);
    });

    it('should return status code 404 for non-existing product', async () => {
      const review = generateReview();

      const res = await req(app)
        .patch(`${uri}/${generateProduct().id}`)
        .set({ cookie: customerWithReview.cookie })
        .send({
          comment: review.comment
        });

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
      expect(res.body.message).toBe(Messages.NOT_FOUND);
    });
  });

  describe('delete review', () => {
    it('should delete review with status code 200', async () => {
      const res = await req(app)
        .delete(`${uri}/${product.id}`)
        .set({ cookie: customerWithReview.cookie });

      expect(res.status).toBe(HttpStatus.OK);
    });

    it('should return status code 401 for not logged in customer', async () => {
      const res = await req(app)
        .delete(`${uri}/${product.id}`);

      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body.message).toBe(Messages.UNAUTHORIZED);
    });

    it('should return status code 404 for non-existing product', async () => {
      const res = await req(app)
        .delete(`${uri}/${generateProduct().id}`)
        .set({ cookie: customerWithReview.cookie });

      expect(res.status).toBe(HttpStatus.NOT_FOUND);
      expect(res.body.message).toBe(Messages.NOT_FOUND);
    });
  });

  afterAll(async () => {
    await Product.destroy({ where: { sellerId: seller.id } });
    await Category.destroy({ where: { name: product.categories } });
    await User.destroy({
      where: {
        id: [customerWithReview.id, customerWithoutReview.id, seller.id]
      }
    });
    await sequelize.close();
  });
});
