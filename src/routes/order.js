const express = require('express');
const paginate = require('express-paginate');

const controllers = require('../controllers/order');
const authorize = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate');
const { Roles } = require('../utils/enums');

const router = express.Router();

const DEFAULT_LIMIT = 4;
const MAX_LIMIT = 10;

router.use(authenticate);

router.patch('/:orderId', controllers.patchOrder);

router.use(authorize(Roles.CUSTOMER));

router.get('/', paginate.middleware(DEFAULT_LIMIT, MAX_LIMIT), controllers.getCustomerOrders);

router.post('/:productId', controllers.postOrder);

router.delete('/:orderId', controllers.deleteOrder);

module.exports = router;
