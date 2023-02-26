const validator = require('validator');
const { UniqueConstraintError } = require('sequelize');
const { createUser } = require('../services/user');

async function register(req, res) {
  const { username, firstName, lastName, password } = req.body;
  const { phone, address, shopName, userType } = req.body;

  if (!username || !firstName || !lastName || !password || !phone || !address || !userType) {
    return res.status(400).json({ msg: 'required fields are missing' });
  }

  if (userType === 'seller' && !shopName) {
    return res.status(400).json({ msg: 'required fields are missing' });
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({ msg: 'weak password' });
  }

  if (!validator.isMobilePhone(phone)) {
    return res.status(400).json({ msg: 'invalid phone number' });
  }

  try {
    await createUser(req.body);
    res.sendStatus(201);
  } catch (err) {
    console.error(err);
    if (err instanceof UniqueConstraintError) {
      const { username } = err.fields;
      res.status(409).json({ msg: `${username} already exists` });
    } else {
      res.sendStatus(500);
    }
  }
}

module.exports = {
  register
};
