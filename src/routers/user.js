const express = require('express');
const { register } = require('../controllers/user');
const passport = require('../configs/passport-config')(require('passport'));

const router = express.Router();

router.post('/register', register);

router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      info.status = 401;
      return next(info);
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }

      res.sendStatus(200);
    });
  })(req, res, next);
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    res.sendStatus(200);
  });
});

module.exports = router;
