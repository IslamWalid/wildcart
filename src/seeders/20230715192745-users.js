const crypto = require('crypto');

const bcrypt = require('bcrypt');

const { Roles } = require('../utils/enums');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const sellerId = crypto.randomUUID();
    const customerId = crypto.randomUUID();
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('StrongPassword@123!', salt);

    await queryInterface.bulkInsert('users', [
      {
        id: sellerId,
        role: Roles.SELLER,
        username: 'jane_doe',
        first_name: 'Jane',
        last_name: 'Doe',
        address: 'address',
        phone: '+201012345678',
        password: hash
      },
      {
        id: customerId,
        role: Roles.CUSTOMER,
        username: 'john_doe',
        first_name: 'John',
        last_name: 'Doe',
        address: 'address',
        phone: '+201087654321',
        password: hash
      }
    ]);

    await queryInterface.bulkInsert('sellers', [{
      id: sellerId,
      shop_name: 'offmarket'
    }]);

    await queryInterface.bulkInsert('customers', [{ id: customerId }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', {
      phone: ['+201012345678', '+201087654321']
    });
  }
};
