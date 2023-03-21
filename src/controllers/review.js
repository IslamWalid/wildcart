const { createReview, retrieveProductReviews } = require('../services/review');
const { OK, CREATED, BAD_REQUEST } = require('../utils/http-status');
const sendResErr = require('../utils/send-res-err');
const { validateInput, inputTypes } = require('../utils/validate-input');

const postReview = async (req, res, next) => {
  const message = validateInput(req.body, inputTypes.POST_REVIEW);
  if (message) {
    return sendResErr(res, { status: BAD_REQUEST, message });
  }

  try {
    await createReview(req.user.id, req.params.productId, req.body);
    res.sendStatus(CREATED);
  } catch (err) {
    next(err);
  }
};

const getReview = async (req, res, next) => {
  try {
    const reviews = await retrieveProductReviews(req.params.productId);
    res.status(OK).json({ reviews });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postReview,
  getReview
};
