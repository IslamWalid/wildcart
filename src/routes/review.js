const express = require('express');

const controllers = require('../controllers/review');
const authorize = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate');
const { Roles } = require('../utils/enums');

const router = express.Router();

router.get('/:productId', controllers.getReview);

router.use(authenticate, authorize(Roles.CUSTOMER));

router.post('/:productId', controllers.postReview);

router.patch('/:productId', controllers.patchReview);

router.delete('/:productId', controllers.deleteReview);

module.exports = router;
