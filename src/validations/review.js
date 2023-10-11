const joi = require('joi');

const postReview = joi.object({
  comment: joi.string().required(),
  rate: joi.number().integer().min(1).max(5).required()
});

const patchReview = joi.object({
  comment: joi.string(),
  rate: joi.number().integer().min(1).max(5)
});

module.exports = {
  postReview,
  patchReview
};
