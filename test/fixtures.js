const { faker } = require('@faker-js/faker');

const { Roles } = require('../src/utils/enums');

function generateUser(user) {
  const role = user.role || (faker.datatype.boolean() ? Roles.CUSTOMER : Roles.SELLER);

  return {
    username: user.username || faker.internet.userName(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: user.password || faker.internet.password(),
    phone: user.phone || faker.phone.number('+201#########'),
    address: faker.location.city(),
    role,
    shopName: role === Roles.SELLER ? faker.company.name() : null
  };
}

module.exports = {
  generateUser
};
