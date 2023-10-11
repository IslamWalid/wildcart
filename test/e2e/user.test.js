require('dotenv').config();
require('../../src/utils/check-env')();

const req = require('supertest');

const app = require('../../app');
const { sequelize, User } = require('../../src/models/');
const { Messages, HttpStatus } = require('../../src/utils/enums');
const { generateUser } = require('../fixtures');

describe('user endpoints', () => {
  const newUser = generateUser();

  describe('user register', () => {
    const uri = '/users/register';

    let existingUser;

    beforeAll(async () => {
      existingUser = await User.findOne({ attributes: ['username', 'phone'], raw: true });
    });

    it('should register new user with return status 201', async () => {
      const res = await req(app).post(uri).send(newUser);

      expect(res.statusCode).toBe(HttpStatus.CREATED);
    });

    it('should try to register user with existing username and return 409 status code', async () => {
      const res = await req(app).post(uri).send(generateUser({ username: existingUser.username }));

      expect(res.statusCode).toBe(409);
      expect(res.body.message).toBe(Messages.USERNAME_ALREADY_EXISTS);
    });

    it('should try to register user with existing phone and return 409 status code', async () => {
      const res = await req(app).post('/users/register').send(generateUser({ phone: existingUser.phone }));

      expect(res.statusCode).toBe(409);
      expect(res.body.message).toBe(Messages.PHONE_ALREADY_EXISTS);
    });
  });

  describe('user login', () => {
    it('should login with valid credentials', async () => {
      const res = await req(app).post('/users/login').send({
        username: newUser.username,
        password: newUser.password
      });

      expect(res.statusCode).toBe(200);
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should login with invalid credentials', async () => {
      const anotherUser = generateUser();
      const res = await req(app).post('/users/login').send({
        username: anotherUser.username,
        password: anotherUser.password
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe(Messages.INVALID_USERNAME);
    });
  });

  afterAll(async () => {
    await User.destroy({ where: { username: newUser.username } });
    await sequelize.close();
  });
});
