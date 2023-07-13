const express = require('express');

const controllers = require('../controllers/product');
const upload = require('../middlewares/upload.js');
const authorize = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate');
const { Roles } = require('../utils/enums');

const router = express.Router();

router.get('/', controllers.getAllProducts);

router.get('/images/:productId', controllers.getProductImage);

router.get('/sellers/:sellerId', controllers.getSellerProducts);

router.get('/:productId', controllers.getProduct);

router.use(authenticate, authorize(Roles.SELLER));

router.post('/', controllers.postProduct);

router.patch('/:productId', controllers.patchProduct);

router.patch('/images/:productId', upload, controllers.patchImage);

module.exports = router;
