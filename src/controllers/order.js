const { createOrder } = require('../services/order');
const { CREATED, BAD_REQUEST } = require('../utils/http-status');
const sendResErr = require('../utils/send-res-err');
const { validateInput, inputTypes } = require('../utils/validate-input');

const postOrder = async (req, res, next) => {
  const message = validateInput(req.body, inputTypes.POST_ORDER);
  if (message) {
    return sendResErr(res, { status: BAD_REQUEST, message });
  }

  try {
    await createOrder(req.user.id, req.params.productId, req.body);
    res.sendStatus(CREATED);
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
