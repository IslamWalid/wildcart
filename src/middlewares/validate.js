const validate = (schema) => async (req, res, next) => {
  const { error: err } = schema.validate(req.body);
  if (err) {
    return next(err);
  }

  next();
};

module.exports = validate;
