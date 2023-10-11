require('dotenv').config();
require('../../src/utils/check-env')();

const req = require('supertest');

const app = require('../../app');
const { sequelize, User } = require('../../src/models/');
const { Messages, HttpStatus } = require('../../src/utils/enums');
const { generateUser } = require('../fixtures');
const { createUser } = require('../../src/services/user');

describe('user endpoints', () => {
  const newUser = generateUser();
  const existingUser = generateUser();

  beforeAll(async () => {
    await createUser(existingUser);
  });

  describe('user register', () => {
    const uri = '/users/register';

    it('should register new user with return status 201', async () => {
      const res = await req(app).post(uri).send(newUser);

      expect(res.statusCode).toBe(HttpStatus.CREATED);
    });

    it('should try to register user with existing username and return 409 status code', async () => {
      const res = await req(app).post(uri).send(generateUser({ username: existingUser.username }));

      expect(res.statusCode).toBe(HttpStatus.CONFLICT);
      expect(res.body.message).toBe(Messages.USERNAME_ALREADY_EXISTS);
    });

    it('should try to register user with existing phone and return 409 status code', async () => {
      const res = await req(app).post(uri).send(generateUser({ phone: existingUser.phone }));

      expect(res.statusCode).toBe(HttpStatus.CONFLICT);
      expect(res.body.message).toBe(Messages.PHONE_ALREADY_EXISTS);
    });
  });

  describe('user login', () => {
    const uri = '/users/login';

    it('should login with valid credentials and return status code 200', async () => {
      const res = await req(app).post(uri).send({
        username: existingUser.username,
        password: existingUser.password
      });

      expect(res.statusCode).toBe(HttpStatus.OK);
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should login with invalid credentials and return status code 401', async () => {
      const anotherUser = generateUser();
      const res = await req(app).post(uri).send({
        username: anotherUser.username,
        password: anotherUser.password
      });

      expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(res.body.message).toBe(Messages.INVALID_USERNAME);
    });
  });

  afterAll(async () => {
    await User.destroy({
      where: {
        username: [newUser.username, existingUser.username]
      }
    });
    await sequelize.close();
  });
});
