const passport = require('../configs/passport');
const sendResErr = require('../utils/send-res-err');
const { validateInput, inputTypes } = require('../utils/validate-input');
const { createUser, retrieveUserDetailsById } = require('../services/user');

const register = async (req, res, next) => {
  const message = validateInput(req.body, inputTypes.REGISTER);
  if (message) {
    return sendResErr(res, { status: 400, message });
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
    return sendResErr(res, { status: 400, message });
  }

  passport.authenticate('local', { session: true }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return sendResErr(res, { status: 401, message: info.message });
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      res.sendStatus(200);
    });
  })(req, res, next);
};

const getUserDetails = async (req, res, next) => {
  try {
    const details = await retrieveUserDetailsById(req.params.id);
    if (!details) {
      return sendResErr(res, { status: 404, message: 'user not found' });
    }
    res.status(200).json(details);
  } catch (err) {
    next(err);
  }
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
  getUserDetails,
  logout
};
