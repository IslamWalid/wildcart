const crypto = require('crypto');

const { Order, sequelize } = require('../models');
const { OrderStatus } = require('../utils/enums');

async function createOrder(customerId, product, order) {
  if (product.quantity < order.quantity) {
    return false;
  }

  await sequelize.transaction(async (t) => {
    await Order.create({
      id: crypto.randomUUID(),
      customerId,
      productId: product.id,
      quantity: order.quantity
    }, {
      transaction: t
    });

    await product.update({
      quantity: product.quantity - order.quantity
    }, {
      transaction: t
    });
  });

  return true;
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

async function updateOrder(user, orderId, order) {

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

module.exports = {
  createOrder,
  retrieveCustomerOrders,
  updateOrder,
  deleteOrder
};
