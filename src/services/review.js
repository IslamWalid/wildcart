const { Product, Review } = require('../models');

async function createReview(customerId, productId, review) {
  await Review.create({
    customerId,
    productId,
    ...review
  });
}

async function retrieveProductReviews(productId) {
  const product = await Product.findByPk(productId, {
    attributes: [],
    include: {
      model: Review,
      attributes: {
        exclude: ['productId']
      }
    }
  });

  return product ? product.reviews : null;
}

async function updateProductReview(customerId, productId, review) {
  const { rate, comment } = review;

  const result = await Review.update({ rate, comment }, {
    where: {
      customerId,
      productId
    }
  });

  return result[0] > 0;
}

async function deleteProductReview(customerId, productId) {
  return await Review.destroy({
    where: {
      customerId,
      productId
    }
  });
}

module.exports = {
  createReview,
  retrieveProductReviews,
  updateProductReview,
  deleteProductReview
};
