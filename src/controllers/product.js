const path = require('path');

const sendResErr = require('../utils/send-res-err');
const { validateInput, inputTypes } = require('../utils/validate-input');
const { HttpStatus, Messages } = require('../utils/enums');
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
    return sendResErr(res, { status: HttpStatus.BAD_REQUEST, message });
  }

  try {
    const id = await createProduct(req.body, req.user.id);
    res.status(HttpStatus.CREATED).json({ id });
  } catch (err) {
    next(err);
  }
};

const patchImage = async (req, res, next) => {
  if (!req.file) {
    return sendResErr(res, {
      status: HttpStatus.BAD_REQUEST,
      message: Messages.MISSING_FIELDS
    });
  }

  try {
    const inserted = await updateProductImage(req.user.id, req.params.productId, req.file.filename);
    if (!inserted) {
      return sendResErr(res, { status: HttpStatus.NOT_FOUND, message: Messages.NOT_FOUND });
    }

    res.sendStatus(HttpStatus.CREATED);
  } catch (err) {
    next(err);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await retrieveAllProducts();
    res.status(HttpStatus.OK).json({ products });
  } catch (err) {
    next(err);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await retrieveProduct(req.params.productId);
    if (!product) {
      return sendResErr(res, { status: HttpStatus.NOT_FOUND, message: Messages.NOT_FOUND });
    }

    res.status(HttpStatus.OK).json({ product });
  } catch (err) {
    next(err);
  }
};

const patchProduct = async (req, res, next) => {
  const message = validateInput(req.body, inputTypes.PATCH_PRODUCT);
  if (message) {
    return sendResErr(res, { status: HttpStatus.BAD_REQUEST, message });
  }

  try {
    const updated = await updateProduct(req.user.id, req.params.productId, req.body);
    if (!updated) {
      return sendResErr(res, { status: HttpStatus.NOT_FOUND, message: Messages.NOT_FOUND });
    }

    res.sendStatus(HttpStatus.OK);
  } catch (err) {
    next(err);
  }
};

const getSellerProducts = async (req, res, next) => {
  try {
    const products = await retrieveSellerProducts(req.params.sellerId);
    if (!products) {
      return sendResErr(res, { status: HttpStatus.NOT_FOUND, message: Messages.NOT_FOUND });
    }

    res.status(HttpStatus.OK).json({ products });
  } catch (err) {
    next(err);
  }
};

const getProductImage = async (req, res, next) => {
  try {
    const filename = await retrieveProductImageFilename(req.params.productId);
    if (!filename) {
      return sendResErr(res, { status: HttpStatus.NOT_FOUND, message: Messages.NOT_FOUND });
    }
    res.sendFile(path.join(__dirname, '../../media', filename));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  postProduct,
  patchImage,
  getProduct,
  patchProduct,
  getAllProducts,
  getSellerProducts,
  getProductImage
};
