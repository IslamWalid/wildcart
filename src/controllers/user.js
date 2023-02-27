const validator = require('validator');
const { createUser } = require('../services/user');
const passport = require('../configs/passport-config')(require('passport'));

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

const login = (req, res, next) => {
  passport.authenticate('local', { session: true }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next(info);
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      res.sendStatus(200);
    });
  })(req, res, next);
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.sendStatus(200);
  });
};

module.exports = {
  register,
  login,
  logout
};
