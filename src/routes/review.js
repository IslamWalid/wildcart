const express = require('express');

const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');
const { Roles } = require('../utils/enums');
const { postReview, getReview, patchReview, deleteReview } = require('../controllers/review');

const router = express.Router();

router.get('/:productId', getReview);

router.use(authenticate, authorize(Roles.CUSTOMER));

router.post('/:productId', postReview);

router.patch('/:productId', patchReview);

router.delete('/:productId', deleteReview);

module.exports = router;
