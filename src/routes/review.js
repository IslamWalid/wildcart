const express = require('express');
const paginate = require('express-paginate');

const controllers = require('../controllers/review');
const authorize = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate');
const { Roles } = require('../utils/enums');
const validate = require('../middlewares/validate');
const validations = require('../validations');

const router = express.Router();

const DEFAULT_LIMIT = 4;
const MAX_LIMIT = 10;

router.get('/:productId', paginate.middleware(DEFAULT_LIMIT, MAX_LIMIT), controllers.getProductReviews);

router.use(authenticate, authorize(Roles.CUSTOMER));

router.post('/:productId', validate(validations.review.post), controllers.postReview);

router.patch('/:productId', validate(validations.review.patch), controllers.patchReview);

router.delete('/:productId', controllers.deleteReview);

module.exports = router;
