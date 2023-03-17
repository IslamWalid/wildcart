const path = require('path');

const upload = require('../configs/multer');
const { sendResErr, createResErr } = require('../utils/err-handler');
const { validateInput, inputTypes } = require('../utils/validate-input');
const {
  listProducts,
  insertProduct,
  setImage,
  getProductById,
  listSellerProducts,
  getProductImageFilename
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
    return sendResErr(res, { status: 400, message });
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
      return sendResErr(res, { status: 404, message: 'product not found' });
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

const uploadImage = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(createResErr(err));
    }

    try {
      const inserted = await setImage(req.file.filename, req.params.productId);
      if (!inserted) {
        return sendResErr(res, { status: 404, message: 'product does not exist' });
      }

      res.sendStatus(201);
    } catch (err) {
      next(createResErr(err));
    }
  });
};

const getProductImage = async (req, res, next) => {
  try {
    const filename = await getProductImageFilename(req.params.productId);
    if (!filename) {
      return sendResErr(res, { status: 404, message: 'product image does not exist' });
    }
    res.sendFile(path.join(__dirname, '../../media', filename));
  } catch (err) {
    next(createResErr(err));
  }
};

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  getSellerProducts,
  uploadImage,
  getProductImage
};
