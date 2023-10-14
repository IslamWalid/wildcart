const express = require('express');
const paginate = require('express-paginate');

const controllers = require('../controllers/order');
const authorize = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate');
const { Roles } = require('../utils/enums');
const validate = require('../middlewares/validate');
const validations = require('../validations');

const router = express.Router();

const DEFAULT_LIMIT = 4;
const MAX_LIMIT = 10;

router.post('/payment-events', controllers.handlePaymentEvents);

router.use(authenticate);

router.get('/', paginate.middleware(DEFAULT_LIMIT, MAX_LIMIT), controllers.getOrders);

router.patch('/:orderId', authorize(Roles.SELLER), validate(validations.order.patch), controllers.patchOrder);

router.use(authorize(Roles.CUSTOMER));

router.post('/:productId', validate(validations.order.post), controllers.postOrder);

router.delete('/:orderId', controllers.deleteOrder);

module.exports = router;
