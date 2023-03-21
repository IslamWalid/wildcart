const express = require('express');

const { authenticateCustomer } = require('../middlewares/authenticate');
const {
  postReview,
  getReview,
  patchReview,
  deleteReview
} = require('../controllers/review');

const router = express.Router();

router.post('/:productId', authenticateCustomer, postReview);

router.get('/:productId', getReview);

router.patch('/:productId', authenticateCustomer, patchReview);

router.delete('/:productId', authenticateCustomer, deleteReview);

module.exports = router;
