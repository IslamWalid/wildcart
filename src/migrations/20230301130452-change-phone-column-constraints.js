module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.changeColumn('user', 'phone', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.changeColumn('user', 'phone', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
