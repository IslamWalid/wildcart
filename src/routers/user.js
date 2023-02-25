const express = require('express');
const { register } = require('../controllers/user');
const passport = require('../configs/passport-config')(require('passport'));

const router = express.Router();

router.post('/register', register);

router.post('/login', (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      res.sendStatus(500);
      return;
    }

    if (!user) {
      res.status(401).json(info);
      return;
    }

    req.login(user, (err) => {
      if (err) {
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
    });
  })(req, res);
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      res.sendStatus(500);
      return;
    }

    res.sendStatus(200);
  });
});

module.exports = router;
