const { faker } = require('@faker-js/faker');

const { Roles } = require('../utils/enums');
const { User, Product } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const customer = await User.findOne({
      attributes: ['id'],
      where: {
        role: Roles.CUSTOMER
      },
      raw: true
    });

    const products = await Product.findAll({
      attributes: ['id'],
      raw: true
    });

    const reviews = [];

    products.forEach((product) => {
      reviews.push({
        customer_id: customer.id,
        product_id: product.id,
        rate: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.sentence({ min: 10, max: 20 }),
        created_at: faker.date.past()
      });
    });

    await queryInterface.bulkInsert('reviews', reviews);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('reviews', {}, { cascade: true });
  }
};
