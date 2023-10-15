const { Review } = require('../models');

async function createReview(customerId, productId, review) {
  await Review.create({
    customerId,
    productId,
    ...review
  });
}

async function retrieveProductReviews(productId, skip, limit) {
  const { rows, count } = await Review.findAndCountAll({
    where: { productId },
    attributes: {
      exclude: ['productId']
    },
    offset: skip,
    limit,
    raw: true
  });

  return {
    reviews: rows,
    pageCount: Math.ceil(count / limit)
  };
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
