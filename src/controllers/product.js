const path = require('path');

const upload = require('../configs/multer');
const sendResErr = require('../utils/send-res-err');
const { validateInput, inputTypes } = require('../utils/validate-input');
const { OK, CREATED, BAD_REQUEST, NOT_FOUND } = require('../utils/http-status');
const {
  createProduct,
  updateProductImage,
  retrieveAllProducts,
  retrieveProduct,
  updateProduct,
  retrieveSellerProducts,
  retrieveProductImageFilename
} = require('../services/product');

const postProduct = async (req, res, next) => {
  const message = validateInput(req.body, inputTypes.POST_PRODUCT);
  if (message) {
    return sendResErr(res, { status: BAD_REQUEST, message });
  }

  try {
    const id = await createProduct(req.body, req.user.id);
    res.status(CREATED).json({ id });
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
        status: BAD_REQUEST,
        message: 'missing required fields'
      });
    }

    try {
      const inserted = await updateProductImage(req.file.filename, req.params.productId);
      if (!inserted) {
        return sendResErr(res, { status: NOT_FOUND, message: 'product not found' });
      }

      res.sendStatus(CREATED);
    } catch (err) {
      next(err);
    }
  });
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await retrieveAllProducts();
    res.status(OK).json({ products });
  } catch (err) {
    next(err);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await retrieveProduct(req.params.productId);
    if (!product) {
      return sendResErr(res, { status: NOT_FOUND, message: 'product not found' });
    }

    res.status(OK).json({ product });
  } catch (err) {
    next(err);
  }
};

const patchProduct = async (req, res, next) => {
  const message = validateInput(req.body, inputTypes.PATCH_PRODUCT);
  if (message) {
    return sendResErr(res, { status: BAD_REQUEST, message });
  }

  try {
    const updated = await updateProduct(req.user.id, req.params.productId, req.body);
    if (!updated) {
      return sendResErr(res, { status: NOT_FOUND, message: 'product not found' });
    }

    res.sendStatus(OK);
  } catch (err) {
    next(err);
  }
};

const getSellerProducts = async (req, res, next) => {
  try {
    const products = await retrieveSellerProducts(req.params.sellerId);
    res.status(OK).json({ products });
  } catch (err) {
    next(err);
  }
};

const getProductImage = async (req, res, next) => {
  try {
    const filename = await retrieveProductImageFilename(req.params.productId);
    if (!filename) {
      return sendResErr(res, { status: NOT_FOUND, message: 'product image does not exist' });
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
  patchProduct,
  getAllProducts,
  getSellerProducts,
  getProductImage
};
