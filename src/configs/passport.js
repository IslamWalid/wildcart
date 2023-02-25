const bcrypt = require('bcrypt');
const { User } = require('../models/');
const LocalStrategy = require('passport-local').Strategy;

const opts = {
  usernameField: 'username',
  passwordField: 'password'
};

function serialize(user, done) {
  done(null, user.id);
}

async function deserialize(id, done) {
  try {
    const user = await User.findOne({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
}

async function verify(username, password, done) {
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      done(null, false, { msg: 'incorrect username' });
      return;
    }
    if (!await bcrypt.compare(password, user.password)) {
      done(null, false, { msg: 'incorrect password' });
      return;
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
}

module.exports = (passport) => {
  passport.serializeUser(serialize);
  passport.deserializeUser(deserialize);
  passport.use(new LocalStrategy(opts, verify));
};
