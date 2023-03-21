const cors = require('cors');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const db = require('./src/models/');
const userRouter = require('./src/routes/user');
const productRouter = require('./src/routes/product');
const reviewRouter = require('./src/routes/review');
const notFound = require('./src/middlewares/not-found');
const errHandler = require('./src/middlewares/err-handler');

const app = express();
const sessionStore = new SequelizeStore({
  db: db.sequelize,
  table: 'session'
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookies: {
    secure: false,
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000 // expires in 7 days
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN
}));

app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/reviews', reviewRouter);

app.use(notFound);
app.use(errHandler);

module.exports = app;
