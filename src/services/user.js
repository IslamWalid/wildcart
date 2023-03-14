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
      userData.customer = { id };
      await User.create(userData, { include: Customer, transaction: t });
    } else {
      userData.seller = { id, shopName: userData.shopName };
      await User.create(userData, { include: Seller, transaction: t });
    }
  });
}

async function getUserDetails(id) {
  const details = await User.findByPk(id, {
    attributes: {
      include: [[sequelize.col('shop_name'), 'shopName']],
      exclude: ['password']
    },
    include: {
      model: Seller,
      attributes: []
    },
    raw: true,
    nest: true
  });

  return details;
}

module.exports = {
  createUser,
  getUserDetails
};
