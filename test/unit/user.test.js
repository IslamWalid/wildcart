require('dotenv').config();

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const req = require('supertest');
const app = require('../../app');
const { sequelize, User, Customer } = require('../../src/models/');

async function createUser() {
  const id = crypto.randomUUID();
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('StrongPassword123!', salt);

  await User.create({
    id: crypto.randomUUID(),
    username: 'john_doe',
    firstName: 'John',
    lastName: 'Doe',
    password: hash,
    address: 'some address',
    phone: '+201012345678',
    userType: 'customer',
    customer: { id }
  },
  {
    include: Customer
  });
}

beforeEach(async () => {
  await sequelize.query('TRUNCATE TABLE "user" CASCADE');
});

describe('user endpoints', () => {
  it('should register new user with valid input', async () => {
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
    expect(res.statusCode).toBe(201);
  });

  it('should register new user with invalid input', async () => {
    const reqBody = {
      username: 'john_doe',
      firstName: 'John',
      lastName: 'Doe',
      password: 'weak password',
      phone: '123',
      address: 'some home address',
      userType: 'customer'
    };
    const res = await req(app).post('/user/register').send(reqBody);
    expect(res.statusCode).toBe(400);
  });

  it('should login with valid credentials', async () => {
    const reqBody = {
      username: 'john_doe',
      password: 'StrongPassword123!'
    };
    await createUser();
    const res = await req(app).post('/user/login').send(reqBody);
    expect(res.statusCode).toBe(200);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should login with invalid credentials', async () => {
    const reqBody = {
      username: 'john_doe',
      password: 'incorrect password'
    };
    await createUser();
    const res = await req(app).post('/user/login').send(reqBody);
    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe('incorrect password');
  });

  it('should logout', async () => {
    const res = await req(app).get('/user/logout');
    expect(res.statusCode).toBe(200);
  });
});

afterAll(async () => {
  await sequelize.close();
});
