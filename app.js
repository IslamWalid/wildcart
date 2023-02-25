const cors = require('cors');
const express = require('express');
const session = require('express-session');
const db = require('./src/models/');
const passport = require('passport');
const configPassport = require('./src/configs/passport');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const sessionStore = new SequelizeStore({
  db: db.sequelize,
  table: 'Session'
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: true,
  cookies: {
    secure: false,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // expires in 7 days
  }
}));

configPassport(passport);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN
}));

app.get('/', (req, res) => {
  res.send({ msg: 'hello' });
});

module.exports = app;
