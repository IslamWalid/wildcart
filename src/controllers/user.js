const validator = require('validator');
const { createUser } = require('../services/user');

const register = async (req, res, next) => {
  const { username, firstName, lastName, password } = req.body;
  const { phone, address, shopName, userType } = req.body;

  if (!username || !firstName || !lastName || !password || !phone || !address || !userType) {
    return res.status(400).json({ message: 'required fields are missing' });
  }

  if (userType === 'seller' && !shopName) {
    return res.status(400).json({ message: 'required fields are missing' });
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({ message: 'weak password' });
  }

  if (!validator.isMobilePhone(phone)) {
    return res.status(400).json({ message: 'invalid phone number' });
  }

  try {
    await createUser(req.body);
    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register
};
