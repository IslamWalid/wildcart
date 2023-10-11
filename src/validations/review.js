const joi = require('joi');

const post = joi.object({
  comment: joi.string().required(),
  rate: joi.number().integer().min(1).max(5).required()
});

const patch = joi.object({
  comment: joi.string(),
  rate: joi.number().integer().min(1).max(5)
});

module.exports = {
  post,
  patch
};
