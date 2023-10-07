const { faker } = require('@faker-js/faker');

const { Customer, Product } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const customer = await Customer.findOne({
      attributes: ['id'],
      raw: true
    });

    const products = await Product.findAll({
      attributes: ['id'],
      raw: true
    });

    const orders = [];

    products.forEach((_) => {
      orders.push({
        id: faker.string.uuid(),
        customer_id: customer.id,
        product_id: _.id,
        payment_intent_id: `pi_${faker.string.alphanumeric({ length: 24 })}`,
        quantity: faker.number.int({ min: 1, max: 10 }),
        order_date: faker.date.anytime()
      });
    });

    await queryInterface.bulkInsert('orders', orders);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('orders', {}, { cascade: true });
  }
};
