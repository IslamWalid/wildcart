const createResErr = require('../utils/get-err-info');
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
    next(createResErr(err));
  }
};

const login = (req, res, next) => {
  const message = validateInput(req.body, inputTypes.LOGIN);
  if (message) {
    return res.status(400).json({ message });
  }

  passport.authenticate('local', { session: true }, (err, user, info) => {
    if (err) {
      return next(createResErr(err));
    }

    if (!user) {
      return res.status(401).json(info);
    }

    req.login(user, (err) => {
      if (err) {
        return next(createResErr(err));
      }

      res.sendStatus(200);
    });
  })(req, res, next);
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(createResErr(err));
    }

    res.sendStatus(200);
  });
};

module.exports = {
  register,
  login,
  logout
};
