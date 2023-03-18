const path = require('path');

const upload = require('../configs/multer');
const sendResErr = require('../utils/send-res-err');
const { validateInput, inputTypes } = require('../utils/validate-input');
const {
  createProduct,
  updateProductImage,
  retrieveAllProducts,
  retrieveProductById,
  retrieveProductsBySellerId,
  retrieveProductImageFilename
} = require('../services/product');

const postProduct = async (req, res, next) => {
  const message = validateInput(req.body, inputTypes.POST_PRODUCT);
  if (message) {
    return sendResErr(res, { status: 400, message });
  }

  try {
    const id = await createProduct(req.body, req.user.id);
    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
};

const uploadImage = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      return next(err);
    }

    if (!req.file) {
      return sendResErr(res, {
        status: 400,
        message: 'missing required fields'
      });
    }

    try {
      const inserted = await updateProductImage(req.file.filename, req.params.productId);
      if (!inserted) {
        return sendResErr(res, { status: 404, message: 'product not found' });
      }

      res.sendStatus(201);
    } catch (err) {
      next(err);
    }
  });
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await retrieveAllProducts();
    res.status(200).json({ products });
  } catch (err) {
    next(err);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await retrieveProductById(req.params.productId);
    if (!product) {
      return sendResErr(res, { status: 404, message: 'product not found' });
    }

    res.status(200).json({ product });
  } catch (err) {
    next(err);
  }
};

const getSellerProducts = async (req, res, next) => {
  try {
    const products = await retrieveProductsBySellerId(req.params.sellerId);
    res.status(200).json({ products });
  } catch (err) {
    next(err);
  }
};

const getProductImage = async (req, res, next) => {
  try {
    const filename = await retrieveProductImageFilename(req.params.productId);
    if (!filename) {
      return sendResErr(res, { status: 404, message: 'product image does not exist' });
    }
    res.sendFile(path.join(__dirname, '../../media', filename));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postProduct,
  uploadImage,
  getProduct,
  getAllProducts,
  getSellerProducts,
  getProductImage
};
