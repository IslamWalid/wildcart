const { createUser } = require('../services/user');
const { validateInput, inputTypes } = require('../utils/validate-input');
const passport = require('../configs/passport-config')(require('passport'));

const register = async (req, res, next) => {
  const message = validateInput(req.body, inputTypes.REGISTER);
  if (message) {
    return res.status(400).json({ message });
  }

  try {
    await createUser(req.body);
    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};

const login = (req, res, next) => {
  const message = validateInput(req.body, inputTypes.LOGIN);
  if (message) {
    return res.status(400).json({ message });
  }

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
