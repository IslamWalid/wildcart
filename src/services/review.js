const { Review } = require('../models');

async function createReview(customerId, productId, review) {
  await Review.create({
    customerId,
    productId,
    ...review
  });
}

async function retrieveProductReviews(productId) {
  return await Review.findAll({ where: { productId } });
}

module.exports = {
  createReview,
  retrieveProductReviews
};
