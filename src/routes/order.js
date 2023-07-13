const express = require('express');

const authenticate = require('../middlewares/authenticate');
const {
  postOrder,
  getUserOrders,
  getOrder,
  patchOrder,
  deleteOrder
} = require('../controllers/order');
const authorize = require('../middlewares/authorize');
const { Roles } = require('../utils/enums');

const router = express.Router();

router.use(authenticate);

router.get('/', getUserOrders);

router.get('/:orderId', getOrder);

router.patch('/:orderId', patchOrder);

router.use(authorize(Roles.CUSTOMER));

router.post('/:productId', postOrder);

router.delete('/:orderId', deleteOrder);

module.exports = router;
