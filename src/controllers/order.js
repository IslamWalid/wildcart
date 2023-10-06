const services = require('../services/order');
const sendResErr = require('../utils/send-res-err');
const validateInput = require('../utils/validate-input');
const { retrieveProduct } = require('../services/product');
const { HttpStatus, InputTypes, Messages, Roles } = require('../utils/enums');

const postOrder = async (req, res, next) => {
  const message = validateInput(req.body, InputTypes.POST_ORDER);
  if (message) {
    return sendResErr(res, { status: HttpStatus.BAD_REQUEST, message });
  }

  try {
    const product = await retrieveProduct(req.params.productId);
    if (!product) {
      return sendResErr(res, { status: HttpStatus.NOT_FOUND, message: Messages.NOT_FOUND });
    }

    if (product.quantity < req.body.quantity) {
      return sendResErr(res, { status: HttpStatus.CONFLICT, message: Messages.INVALID_QUANTITY });
    }

    res.status(HttpStatus.CREATED).json({
      clientSecret: await services.createOrder(req.user.id, product, req.body.quantity)
    });
  } catch (err) {
    next(err);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const { orders, pageCount } = req.user.role === Roles.CUSTOMER
      ? await services.retrieveCustomerOrders(req.user.id, req.skip, req.query.limit)
      : await services.retrieveSellerOrders(req.user.id, req.skip, req.query.limit);

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
  try {
    const isUpdated = await services.updateOrderStatus(req.user.id, req.params.orderId, req.body.status);
    if (!isUpdated) {
      return sendResErr(res, { status: HttpStatus.NOT_FOUND, message: Messages.ORDER_NOT_FOUND });
    }

    res.sendStatus(HttpStatus.OK);
  } catch (err) {
    next(err);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const isDeleted = await services.deleteOrder(req.user.id, req.params.orderId);
    if (!isDeleted) {
      return sendResErr(res, { status: HttpStatus.CONFLICT, message: Messages.CANCEL_REFUSED });
    }

    res.sendStatus(HttpStatus.OK);
  } catch (err) {
    next(err);
  }
};

const handlePaymentEvents = async (req, res, next) => {
  try {
    const event = services.retrievePaymentEvent(req.headers['stripe-signature'], req.rawBody);
    res.sendStatus(HttpStatus.OK);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await services.handlePaymentIntentSucceeded();
        break;

      default:
        break;
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postOrder,
  getOrders,
  patchOrder,
  deleteOrder,
  handlePaymentEvents
};
