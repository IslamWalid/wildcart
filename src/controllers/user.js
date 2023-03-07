const createResErr = require('../utils/create-res-err');
const passport = require('../configs/passport-config')(require('passport'));
const { createUser, getUserDetails } = require('../services/user');
const { validateInput, inputTypes } = require('../utils/validate-input');

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

const userDetails = async (req, res, next) => {
  try {
    const details = await getUserDetails(req.params.id);
    if (!details) {
      return res.status(404).json({ message: 'user not found' });
    }
    res.status(200).json(details);
  } catch (err) {
    next(createResErr(err));
  }
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
  userDetails,
  logout
};
