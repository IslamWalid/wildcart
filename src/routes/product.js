const express = require('express');

const { authenticateSeller } = require('../middlewares/authenticate.js');
const {
  getAllProducts,
  postProduct,
  getSellerProducts,
  getProduct,
  patchProduct,
  uploadImage,
  getProductImage
} = require('../controllers/product');

const router = express.Router();

router.get('/', getAllProducts);

router.post('/', authenticateSeller, postProduct);

router.get('/:productId', getProduct);

router.patch('/:productId', authenticateSeller, patchProduct);

router.post('/images/:productId', authenticateSeller, uploadImage);

router.patch('/images/:productId', authenticateSeller, uploadImage);

router.get('/images/:productId', getProductImage);

router.get('/sellers/:sellerId', getSellerProducts);

module.exports = router;
