const express = require('express');

const authenticate = require('../middlewares/authenticate');
const upload = require('../middlewares/upload.js');
const {
  getAllProducts,
  postProduct,
  getSellerProducts,
  getProduct,
  patchProduct,
  patchImage,
  getProductImage
} = require('../controllers/product');
const authorize = require('../middlewares/authorize');
const { Roles } = require('../utils/enums');

const router = express.Router();

router.get('/', getAllProducts);

router.get('/images/:productId', getProductImage);

router.get('/sellers/:sellerId', getSellerProducts);

router.get('/:productId', getProduct);

router.use(authenticate, authorize(Roles.SELLER));

router.post('/', postProduct);

router.patch('/:productId', patchProduct);

router.patch('/images/:productId', upload, patchImage);

module.exports = router;
