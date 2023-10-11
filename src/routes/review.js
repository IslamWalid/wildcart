const express = require('express');

const controllers = require('../controllers/review');
const authorize = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate');
const { Roles } = require('../utils/enums');
const validate = require('../middlewares/validate');
const validations = require('../validations');

const router = express.Router();

router.get('/:productId', controllers.getReview);

router.use(authenticate, authorize(Roles.CUSTOMER));

router.post('/:productId', validate(validations.review.post), controllers.postReview);

router.patch('/:productId', validate(validations.review.patch), controllers.patchReview);

router.delete('/:productId', controllers.deleteReview);

module.exports = router;
