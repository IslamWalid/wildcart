const express = require('express');
const { register } = require('../controllers/user');
const passport = require('../configs/passport-config')(require('passport'));

const router = express.Router();

router.post('/register', register);

router.post('/login', (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return res.sendStatus(500);
    }

    if (!user) {
      return res.status(401).json(info);
    }

    req.login(user, (err) => {
      if (err) {
        return res.sendStatus(500);
      }

      res.sendStatus(200);
    });
  })(req, res);
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.sendStatus(500);
    }

    res.sendStatus(200);
  });
});

module.exports = router;
