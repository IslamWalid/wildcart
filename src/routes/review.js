const express = require('express');

const { postReview, getReview } = require('../controllers/review');
const { authenticateCustomer } = require('../middlewares/authenticate');

const router = express.Router();

router.post('/:productId', authenticateCustomer, postReview);

router.get('/:productId', getReview);

module.exports = router;
