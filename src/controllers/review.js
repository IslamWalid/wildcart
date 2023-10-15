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

const getProductReviews = async (req, res, next) => {
  try {
    const { reviews, pageCount } =
      await services.retrieveProductReviews(req.params.productId, req.skip, req.query.limit);

    const next = res.locals.paginate.hasNextPages(pageCount)
      ? res.locals.paginate.href()
      : null;
    const prev = res.locals.paginate.hasPreviousPages
      ? res.locals.paginate.href(true)
      : null;

    res.status(HttpStatus.OK).json({ reviews, next, prev, pageCount });
  } catch (err) {
    next(err);
  }
};

const patchReview = async (req, res, next) => {
  try {
    const updated = await services.updateProductReview(req.user.id, req.params.productId, req.body);
    if (!updated) {
      return sendResErr(res, { status: HttpStatus.NOT_FOUND, message: Messages.NOT_FOUND });
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
      return sendResErr(res, { status: HttpStatus.NOT_FOUND, message: Messages.NOT_FOUND });
    }

    res.sendStatus(HttpStatus.OK);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postReview,
  getProductReviews,
  patchReview,
  deleteReview
};
