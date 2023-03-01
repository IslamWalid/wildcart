require('dotenv').config();
require('../../src/utils/check-env')();

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const req = require('supertest');
const app = require('../../app');
const { sequelize, User, Customer } = require('../../src/models/');

beforeAll(async () => {
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
    userType: 'customer',
    Customer: { id }
  },
  {
    include: Customer
  });
});

describe('user register', () => {
  it('should register new user with valid input', async () => {
    const reqBody = {
      username: 'jane_doe',
      firstName: 'Jane',
      lastName: 'Doe',
      password: 'AnotherStrongPassword123!',
      phone: '+201087654321',
      address: 'some home address',
      userType: 'seller',
      shopName: 'offmarket'
    };
    const res = await req(app).post('/user/register').send(reqBody);
    expect(res.statusCode).toBe(201);
  });

  it('should register already existing user', async () => {
    const reqBody = {
      username: 'john_doe',
      firstName: 'John',
      lastName: 'Doe',
      password: 'StrongPassword123!',
      phone: '+201012345678',
      address: 'some home address',
      userType: 'customer'
    };
    const res = await req(app).post('/user/register').send(reqBody);
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe('username already exists');
  });

  it('should register new user with already used phone number', async () => {
    const reqBody = {
      username: 'john_lnu',
      firstName: 'John',
      lastName: 'Lnu',
      password: 'AnotherStrongPassword123!',
      phone: '+201012345678',
      address: 'some home address',
      userType: 'seller',
      shopName: 'offmarket'
    };
    const res = await req(app).post('/user/register').send(reqBody);
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe('phone number is already used');
  });
});

describe('user login', () => {
  it('should login with valid credentials', async () => {
    const reqBody = {
      username: 'john_doe',
      password: 'StrongPassword123!'
    };
    const res = await req(app).post('/user/login').send(reqBody);
    expect(res.statusCode).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should login with invalid credentials', async () => {
    const reqBody = {
      username: 'john_doe',
      password: 'incorrect password'
    };
    const res = await req(app).post('/user/login').send(reqBody);
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe('incorrect password');
  });
});

afterAll(async () => {
  await sequelize.query('TRUNCATE TABLE "user" CASCADE');
  await sequelize.close();
});
