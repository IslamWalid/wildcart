const createResErr = require('../utils/get-err-info');
const { listProducts, insertProduct } = require('../services/product');
const { validateInput, inputTypes } = require('../utils/validate-input');

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
    await insertProduct(req.body, req.user.id);
    res.sendStatus(201);
  } catch (err) {
    next(createResErr(err));
  }
};

module.exports = {
  getAllProducts,
  createProduct
};
