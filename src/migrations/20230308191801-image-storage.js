module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('product', 'image');
    await queryInterface.addColumn('product', 'image_filename', {
      type: Sequelize.STRING
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('product', 'image_filename');
    await queryInterface.addColumn('product', 'image', {
      type: Sequelize.BLOB
    });
  }
};
