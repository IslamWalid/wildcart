const { createOrder } = require('../services/order');
const { HttpStatus, InputTypes } = require('../utils/enums');
const sendResErr = require('../utils/send-res-err');
const validateInput = require('../utils/validate-input');

const postOrder = async (req, res, next) => {
  const message = validateInput(req.body, InputTypes.POST_ORDER);
  if (message) {
    return sendResErr(res, { status: HttpStatus.BAD_REQUEST, message });
  }

  try {
    await createOrder(req.user.id, req.params.productId, req.body);
    res.sendStatus(HttpStatus.CREATED);
  } catch (err) {
    next(err);
  }
};

const getUserOrders = async (req, res, next) => {

};

const getOrder = async (req, res, next) => {

};

const patchOrder = async (req, res, next) => {

};

const deleteOrder = async (req, res, next) => {

};

module.exports = {
  postOrder,
  getUserOrders,
  getOrder,
  patchOrder,
  deleteOrder
};
