module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('products', {
      type: 'unique',
      fields: ['name', 'seller_id'],
      name: 'product_name_seller_id_unique_constraint'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('products', 'product_name_seller_id_unique_constraint');
  }
};
