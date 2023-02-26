const { UniqueConstraintError } = require('sequelize');

const errHandler = async (err, req, res, next) => {
  if (err instanceof UniqueConstraintError) {
    const { username } = err.fields;
    if (username) {
      res.status(409).json({ msg: 'username already exists' });
    }
  } else if (err.status) {
    res.status(err.status).json({ msg: err.msg });
  } else {
    res.sendStatus(500);
  }
};

module.exports = errHandler;
