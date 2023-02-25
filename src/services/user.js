const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { User, Customer, Seller } = require('../models');

async function createUser(userData) {
  const id = crypto.randomUUID();

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(userData.password, salt);

  userData.id = id;
  userData.password = hash;

  if (userData.userType === 'customer') {
    userData.Customer = { id };
    await User.create(userData, { include: Customer });
  } else {
    userData.Seller = { id, shopName: userData.shopName };
    await User.create(userData, { include: Seller });
  }
}

module.exports = {
  createUser
};
