const { faker } = require('@faker-js/faker');

const { Roles } = require('../src/utils/enums');

function generateUser(user) {
  const role = user?.role || (faker.datatype.boolean() ? Roles.CUSTOMER : Roles.SELLER);

  return {
    username: user?.username || faker.internet.userName(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: user?.password || 'StrongPassword@12345!!',
    phone: user?.phone || faker.phone.number('+2010########'),
    address: faker.location.city(),
    role,
    shopName: role === Roles.SELLER ? faker.company.name() : null
  };
}

function generateProduct(product) {
  return {
    name: product?.name || faker.commerce.productName(),
    sellerId: product?.sellerId || faker.string.uuid(),
    price: faker.number.int({ min: 10, max: 200 }),
    quantity: faker.number.int({ min: 1, max: 50 }),
    brand: faker.company.name(),
    avgRate: faker.number.float({ min: 1, max: 5, precision: 2 }),
    categories: product?.categories || generateMultiple(generateCategory, faker.number.int({ min: 1, max: 3 }))
  };
}

function generateCategory(category) {
  return {
    name: category?.name || `${faker.commerce.department()}-${Date.now()}`
  };
}

function generateMultiple(generator, count, obj) {
  return faker.helpers.multiple(() => generator(obj), { count });
}

module.exports = {
  generateUser,
  generateProduct,
  generateCategory,
  generateMultiple
};
