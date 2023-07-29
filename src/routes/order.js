const express = require('express');

const controllers = require('../controllers/order');
const authorize = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate');
const { Roles } = require('../utils/enums');

const router = express.Router();

router.use(authenticate);

router.patch('/:orderId', controllers.patchOrder);

router.use(authorize(Roles.CUSTOMER));

router.get('/:orderId', controllers.getOrder);

router.get('/', controllers.getCustomerOrders);

router.post('/:productId', controllers.postOrder);

router.delete('/:orderId', controllers.deleteOrder);

module.exports = router;
