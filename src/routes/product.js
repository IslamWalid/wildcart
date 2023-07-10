const express = require('express');

const { authenticateSeller } = require('../middlewares/authenticate.js');
const {
  getAllProducts,
  postProduct,
  getSellerProducts,
  getProduct,
  patchProduct,
  patchImage,
  getProductImage
} = require('../controllers/product');
const upload = require('../middlewares/upload.js');

const router = express.Router();

router.get('/', getAllProducts);

router.post('/', authenticateSeller, postProduct);

router.get('/:productId', getProduct);

router.patch('/:productId', authenticateSeller, patchProduct);

router.patch('/images/:productId', authenticateSeller, upload, patchImage);

router.get('/images/:productId', getProductImage);

router.get('/sellers/:sellerId', getSellerProducts);

module.exports = router;
