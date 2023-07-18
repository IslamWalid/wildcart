const { faker } = require('@faker-js/faker');

const { Seller, Category } = require('../models');

function generateProduct(sellerId) {
  return () => {
    return {
      id: faker.string.uuid(),
      seller_id: sellerId,
      name: faker.commerce.productName(),
      brand: faker.company.name(),
      quantity: faker.number.int({ min: 0, max: 20 }),
      price: faker.number.int({ min: 100, max: 1000 }),
      image_url: faker.image.url()
    };
  };
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const seller = await Seller.findOne({ attribute: ['id'], raw: true });
    const products = faker.helpers.multiple(generateProduct(seller.id), { count: 50 });
    const categories = await Category.findAll({ raw: true });
    const productsCategories = [];

    products.forEach((product) => {
      const offset = faker.number.int({ min: 0, max: categories.length - 3 });
      for (let i = 0; i < 3; i++) {
        productsCategories.push({
          product_id: product.id,
          category_name: categories[offset + i].name
        });
      }
    });

    await queryInterface.bulkInsert('products', products);
    await queryInterface.bulkInsert('products_categories', productsCategories);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', {}, { cascade: true });
  }
};
