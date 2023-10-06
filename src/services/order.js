const crypto = require('crypto');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const { Order, Product, sequelize } = require('../models');
const { OrderStatus } = require('../utils/enums');

async function createOrder(customerId, product, quantity) {
  await sequelize.transaction(async (t) => {
    await Order.create({
      id: crypto.randomUUID(),
      customerId,
      productId: product.id,
      quantity
    }, {
      transaction: t
    });

    await product.update({
      quantity: product.quantity - quantity
    }, {
      transaction: t
    });
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.price * quantity * 100,
    currency: 'usd'
  });

  return paymentIntent.client_secret;
}

async function retrieveCustomerOrders(customerId, skip, limit) {
  const { rows, count } = await Order.findAndCountAll({
    where: { customerId },
    raw: true,
    limit,
    offset: skip
  });

  return {
    orders: rows,
    pageCount: Math.ceil(count / limit)
  };
}

async function retrieveSellerOrders(sellerId, skip, limit) {
  const { rows, count } = await Order.findAndCountAll({
    include: {
      model: Product,
      attributes: [],
      required: true,
      where: { sellerId }
    },
    subQuery: false,
    raw: true
  });

  return {
    orders: rows,
    pageCount: Math.ceil(count / limit)
  };
}

async function updateOrderStatus(sellerId, orderId, status) {
  const order = await Order.findOne({
    where: { id: orderId },
    include: {
      model: Product,
      required: true,
      where: {
        sellerId
      }
    }
  });

  if (!order) {
    return null;
  }

  return await order.update({ status });
}

async function deleteOrder(customerId, orderId) {
  const deletedRows = await Order.destroy({
    where: {
      id: orderId,
      customerId,
      status: OrderStatus.PENDING
    }
  });

  return deletedRows === 1;
}

function retrievePaymentEvent(stripeSignature, payload) {
  return stripe.webhooks.constructEvent(payload, stripeSignature, process.env.STRIPE_WEBHOOK_SECRET_KEY);
}

async function handlePaymentIntentSucceeded() {

}

module.exports = {
  createOrder,
  retrieveCustomerOrders,
  retrieveSellerOrders,
  updateOrderStatus,
  deleteOrder,
  retrievePaymentEvent,
  handlePaymentIntentSucceeded
};
