const services = require('../services/product');
const sendResErr = require('../utils/send-res-err');
const validateInput = require('../utils/validate-input');
const { HttpStatus, Messages, InputTypes } = require('../utils/enums');

const postProduct = async (req, res, next) => {
  const message = validateInput(req.body, InputTypes.POST_PRODUCT);
  if (message) {
    return sendResErr(res, { status: HttpStatus.BAD_REQUEST, message });
  }

  try {
    const id = await services.createProduct(req.body, req.user.id);
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
    const imageURL = `${req.headers.host}/${req.file.filename}`;
    await services.updateProductImage(req.user.id, req.params.productId, imageURL);
    res.sendStatus(HttpStatus.OK);
  } catch (err) {
    next(err);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await services.retrieveAllProducts();
    res.status(HttpStatus.OK).json({ products });
  } catch (err) {
    next(err);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await services.retrieveProduct(req.params.productId);
    if (!product) {
      return sendResErr(res, { status: HttpStatus.NOT_FOUND, message: Messages.NOT_FOUND });
    }

    res.status(HttpStatus.OK).json({ product });
  } catch (err) {
    next(err);
  }
};

const patchProduct = async (req, res, next) => {
  const message = validateInput(req.body, InputTypes.PATCH_PRODUCT);
  if (message) {
    return sendResErr(res, { status: HttpStatus.BAD_REQUEST, message });
  }

  try {
    const updated = await services.updateProduct(req.user.id, req.params.productId, req.body);
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
    const products = await services.retrieveSellerProducts(req.params.sellerId);
    if (!products) {
      return sendResErr(res, { status: HttpStatus.NOT_FOUND, message: Messages.NOT_FOUND });
    }

    res.status(HttpStatus.OK).json({ products });
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
  getSellerProducts
};
