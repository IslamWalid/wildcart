const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { User } = require('../models/');

const opts = {
  usernameField: 'username',
  passwordField: 'password'
};

function serialize(user, done) {
  done(null, user.id);
}

async function deserialize(id, done) {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
}

async function verify(username, password, done) {
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return done(null, false, { message: 'incorrect username' });
    }

    if (!await bcrypt.compare(password, user.password)) {
      return done(null, false, { message: 'incorrect password' });
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
}

passport.serializeUser(serialize);
passport.deserializeUser(deserialize);
passport.use(new LocalStrategy(opts, verify));

module.exports = passport;
