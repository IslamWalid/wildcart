const services = require('../services/review');
const sendResErr = require('../utils/send-res-err');
const { HttpStatus, Messages } = require('../utils/enums');

const postReview = async (req, res, next) => {
  try {
    await services.createReview(req.user.id, req.params.productId, req.body);
    res.sendStatus(HttpStatus.CREATED);
  } catch (err) {
    next(err);
  }
};

const getReview = async (req, res, next) => {
  try {
    const reviews = await services.retrieveProductReviews(req.params.productId);
    if (!reviews) {
      return sendResErr(res, { status: HttpStatus.NOT_FOUND, message: Messages.NOT_FOUND });
    }

    res.status(HttpStatus.OK).json({ reviews });
  } catch (err) {
    next(err);
  }
};

const patchReview = async (req, res, next) => {
  try {
    const updated = await services.updateProductReview(req.user.id, req.params.productId, req.body);
    if (!updated) {
      return sendResErr(res, { status: 404, message: Messages.NOT_FOUND });
    }

    res.sendStatus(HttpStatus.OK);
  } catch (err) {
    next(err);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const deleted = await services.deleteProductReview(req.user.id, req.params.productId);
    if (!deleted) {
      return sendResErr(res, { status: 404, message: Messages.NOT_FOUND });
    }

    res.sendStatus(HttpStatus.OK);
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
