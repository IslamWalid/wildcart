const express = require('express');

const { authenticateCustomer, authenticateUser } = require('../middlewares/authenticate');
const {
  postOrder,
  getUserOrders,
  getOrder,
  patchOrder,
  deleteOrder
} = require('../controllers/order');

const router = express.Router();

router.post('/:productId', authenticateCustomer, postOrder);

router.get('/', authenticateUser, getUserOrders);

router.get('/:orderId', authenticateUser, getOrder);

router.patch('/:orderId', authenticateUser, patchOrder);

router.delete('/:orderId', authenticateCustomer, deleteOrder);

module.exports = router;
