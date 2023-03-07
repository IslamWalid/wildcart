const express = require('express');

const { authenticateSeller } = require('../middlewares/authenticate.js');
const {
  getAllProducts,
  createProduct,
  getSellerProducts,
  getProduct
} = require('../controllers/product');

const router = express.Router();

router.get('/', getAllProducts);

router.post('/', authenticateSeller, createProduct);

router.get('/:productId', getProduct);

router.get('/sellers/:sellerId', getSellerProducts);

module.exports = router;
