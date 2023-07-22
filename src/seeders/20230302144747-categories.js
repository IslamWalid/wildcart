module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = [
      { name: 'books' },
      { name: 'sports' },
      { name: 'clothes' },
      { name: 'mobiles' },
      { name: 'laptops' },
      { name: 'computers' },
      { name: 'supermarket' },
      { name: 'men fashion' },
      { name: 'kids fashion' },
      { name: 'women fashion' }
    ];

    await queryInterface.bulkInsert('categories', categories);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', {}, { cascade: true });
  }
};
