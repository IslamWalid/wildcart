const crypto = require('crypto');

const bcrypt = require('bcrypt');

const { Roles } = require('../utils/enums');
const { sequelize, User, Customer, Seller } = require('../models');

async function createUser(userData) {
  const user = { ...userData };
  const id = crypto.randomUUID();

  const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
  const hash = await bcrypt.hash(user.password, salt);

  user.id = id;
  user.password = hash;

  await sequelize.transaction(async (t) => {
    if (user.role === Roles.CUSTOMER) {
      user.customer = { id };
      await User.create(user, { include: Customer, transaction: t });
    } else {
      user.seller = { id, shopName: user.shopName };
      await User.create(user, { include: Seller, transaction: t });
    }
  });
}

async function retrieveUserDetailsById(id) {
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
  retrieveUserDetailsById
};
