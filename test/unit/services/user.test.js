require('dotenv').config();

const req = require('supertest');
const app = require('../../../app');
const { sequelize } = require('../../../src/models/');

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
  it.todo('should login with valid credentials');
  it.todo('should login with invalid credentials');
  it.todo('should logout');
});

afterAll(async () => {
  await sequelize.close();
});
