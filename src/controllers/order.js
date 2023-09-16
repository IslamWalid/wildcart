const services = require('../services/order');
const sendResErr = require('../utils/send-res-err');
const validateInput = require('../utils/validate-input');
const { retrieveProduct } = require('../services/product');
const { HttpStatus, InputTypes, Messages } = require('../utils/enums');

const postOrder = async (req, res, next) => {
  const message = validateInput(req.body, InputTypes.POST_ORDER);
  if (message) {
    return sendResErr(res, { status: HttpStatus.BAD_REQUEST, message });
  }

  try {
    const product = await retrieveProduct(req.params.id);
    if (!product) {
      return sendResErr(res, { status: HttpStatus.NOT_FOUND, message: Messages.NOT_FOUND });
    }

    const isCreated = await services.createOrder(req.user.id, product, req.body);
    if (!isCreated) {
      return sendResErr(res, { status: HttpStatus.CONFLICT, message: Messages.INVALID_QUANTITY });
    }

    res.sendStatus(HttpStatus.CREATED);
  } catch (err) {
    next(err);
  }
};

const getCustomerOrders = async (req, res, next) => {
  try {
    const { orders, pageCount } = await services.retrieveCustomerOrders(req.user.id, req.skip, req.query.limit);

    const next = res.locals.paginate.hasNextPages(pageCount)
      ? res.locals.paginate.href()
      : null;
    const prev = res.locals.paginate.hasPreviousPages
      ? res.locals.paginate.href(true)
      : null;

    res.status(HttpStatus.OK).json({ orders, next, prev, pageCount });
  } catch (err) {
    next(err);
  }
};

const patchOrder = async (req, res, next) => {

};

const deleteOrder = async (req, res, next) => {

};

module.exports = {
  postOrder,
  getCustomerOrders,
  patchOrder,
  deleteOrder
};
