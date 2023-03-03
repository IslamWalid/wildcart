const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { sequelize, User, Customer, Seller } = require('../models');

async function createUser(userData) {
  const id = crypto.randomUUID();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(userData.password, salt);

  userData.id = id;
  userData.password = hash;

  await sequelize.transaction(async (t) => {
    if (userData.userType === 'customer') {
      userData.Customer = { userId: id };
      await User.create(userData, { include: Customer, transaction: t });
    } else {
      userData.Seller = { userId: id, shopName: userData.shopName };
      await User.create(userData, { include: Seller, transaction: t });
    }
  });
}

module.exports = {
  createUser
};
