const { Model, DataTypes } = require('sequelize');

class User extends Model {
  static init(sequelize) {
    super.init({
      id: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      userType: {
        type: DataTypes.ENUM(['customer', 'seller']),
        defaultValue: 'customer'
      }
    },
    {
      sequelize,
      modelName: 'user',
      tableName: 'user',
      underscored: true,
      timestamps: false
    });
  }

  static associate(models) {
    const Seller = this.sequelize.models.seller;
    const Customer = this.sequelize.models.customer;

    this.hasOne(Seller, { foreignKey: 'id' });
    this.hasOne(Customer, { foreignKey: 'id' });
  }
}

module.exports = User;
