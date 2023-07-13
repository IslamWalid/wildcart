const express = require('express');

const controllers = require('../controllers/order');
const authorize = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate');
const { Roles } = require('../utils/enums');

const router = express.Router();

router.use(authenticate);

router.get('/', controllers.getUserOrders);

router.get('/:orderId', controllers.getOrder);

router.patch('/:orderId', controllers.patchOrder);

router.use(authorize(Roles.CUSTOMER));

router.post('/:productId', controllers.postOrder);

router.delete('/:orderId', controllers.deleteOrder);

module.exports = router;
