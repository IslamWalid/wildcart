const { OK, CREATED, BAD_REQUEST, NOT_FOUND } = require('../utils/http-status');
const sendResErr = require('../utils/send-res-err');
const { validateInput, inputTypes } = require('../utils/validate-input');
const {
  createReview,
  retrieveProductReviews,
  updateProductReview,
  deleteProductReview
} = require('../services/review');

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
    if (!reviews) {
      return sendResErr(res, { status: NOT_FOUND, message: 'product not found' });
    }

    res.status(OK).json({ reviews });
  } catch (err) {
    next(err);
  }
};

const patchReview = async (req, res, next) => {
  const message = validateInput(req.body, inputTypes.PATCH_REVIEW);
  if (message) {
    return sendResErr(res, { status: BAD_REQUEST, message });
  }

  try {
    const updated = await updateProductReview(req.user.id, req.params.productId, req.body);
    if (!updated) {
      return sendResErr(res, { status: 404, message: 'product review not found' });
    }

    res.sendStatus(OK);
  } catch (err) {
    next(err);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const deleted = await deleteProductReview(req.user.id, req.params.productId);
    if (!deleted) {
      return sendResErr(res, { status: 404, message: 'product review not found' });
    }

    res.sendStatus(OK);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postReview,
  getReview,
  patchReview,
  deleteReview
};
