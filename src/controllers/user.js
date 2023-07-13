const passport = require('../configs/passport');
const sendResErr = require('../utils/send-res-err');
const { validateInput, inputTypes } = require('../utils/validate-input');
const { createUser, retrieveUserDetailsById } = require('../services/user');
const { HttpStatus, Messages } = require('../utils/enums');

const register = async (req, res, next) => {
  const message = validateInput(req.body, inputTypes.REGISTER);
  if (message) {
    return sendResErr(res, { status: HttpStatus.BAD_REQUEST, message });
  }

  try {
    await createUser(req.body);
    res.sendStatus(HttpStatus.CREATED);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  passport.authenticate('local', { session: true }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return sendResErr(res, { status: HttpStatus.UNAUTHORIZED, message: info.message });
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      res.sendStatus(HttpStatus.OK);
    });
  })(req, res, next);
};

const getUserDetails = async (req, res, next) => {
  try {
    const details = await retrieveUserDetailsById(req.params.id);
    if (!details) {
      return sendResErr(res, { status: HttpStatus.NOT_FOUND, message: Messages.NOT_FOUND });
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

    res.sendStatus(HttpStatus.OK);
  });
};

module.exports = {
  register,
  login,
  getUserDetails,
  logout
};
