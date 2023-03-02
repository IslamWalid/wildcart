module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint('product', {
      type: 'unique',
      fields: ['name', 'seller_id'],
      name: 'product_name_seller_id_unique_constraint'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('product', 'product_name_seller_id_unique_constraint');
  }
};
