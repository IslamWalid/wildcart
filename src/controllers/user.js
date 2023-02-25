const validator = require('validator');
const { UniqueConstraintError } = require('sequelize');
const { createUser } = require('../services/user');

async function register(req, res) {
  const { username, firstName, lastName, password } = req.body;
  const { phone, address, shopName, userType } = req.body;

  if (!username || !firstName || !lastName || !password || !phone || !address || !userType) {
    res.status(400).json({ msg: 'required fields are missing' });
    return;
  }

  if (userType === 'seller' && !shopName) {
    res.status(400).json({ msg: 'required fields are missing' });
    return;
  }

  if (!validator.isStrongPassword(password)) {
    res.status(400).json({ msg: 'weak password' });
    return;
  }

  if (!validator.isMobilePhone(phone)) {
    res.status(400).json({ msg: 'invalid phone number' });
    return;
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
