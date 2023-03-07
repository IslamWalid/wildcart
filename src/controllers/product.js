const createResErr = require('../utils/create-res-err');
const { validateInput, inputTypes } = require('../utils/validate-input');
const {
  listProducts,
  insertProduct,
  getProductById,
  listSellerProducts
} = require('../services/product');

const getAllProducts = async (req, res, next) => {
  try {
    const products = await listProducts();
    res.status(200).json({ products });
  } catch (err) {
    next(createResErr(err));
  }
};

const createProduct = async (req, res, next) => {
  const message = validateInput(req.body, inputTypes.CREATE_PRODUCT);
  if (message) {
    return res.status(400).json({ message });
  }

  try {
    const id = await insertProduct(req.body, req.user.id);
    res.status(201).json({ id });
  } catch (err) {
    next(createResErr(err));
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await getProductById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'product not found' });
    }

    res.status(200).json({ product });
  } catch (err) {
    next(createResErr(err));
  }
};

const getSellerProducts = async (req, res, next) => {
  try {
    const products = await listSellerProducts(req.params.sellerId);
    res.status(200).json({ products });
  } catch (err) {
    next(createResErr(err));
  }
};

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  getSellerProducts
};
