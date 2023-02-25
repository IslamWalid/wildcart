module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('session', {
      sid: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      expires: Sequelize.DATE,
      data: Sequelize.STRING
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('session', { cascade: true });
  }
};
