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

module.exports = {
  generateUser
};
