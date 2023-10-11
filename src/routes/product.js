const express = require('express');
const paginate = require('express-paginate');

const controllers = require('../controllers/product');
const upload = require('../middlewares/upload.js');
const authorize = require('../middlewares/authorize');
const authenticate = require('../middlewares/authenticate');
const validate = require('../middlewares/validate');
const validations = require('../validations');
const { Roles } = require('../utils/enums');

const router = express.Router();

const DEFAULT_LIMIT = 4;
const MAX_LIMIT = 10;

router.get('/', paginate.middleware(DEFAULT_LIMIT, MAX_LIMIT), controllers.getAllProducts);

router.get('/sellers/:sellerId', paginate.middleware(DEFAULT_LIMIT, MAX_LIMIT), controllers.getSellerProducts);

router.get('/:productId', controllers.getProduct);

router.use(authenticate, authorize(Roles.SELLER));

router.post('/', validate(validations.product.post), controllers.postProduct);

router.patch('/:productId', validate(validations.product.patch), controllers.patchProduct);

router.patch('/images/:productId', upload, controllers.patchImage);

module.exports = router;
