const express = require('express');
const { getAllProducts, createProduct } = require('../controllers/product');
const { authenticateSeller } = require('../middlewares/authenticate.js');

const router = express.Router();

router.get('/', getAllProducts);

router.post('/', authenticateSeller, createProduct);

module.exports = router;
