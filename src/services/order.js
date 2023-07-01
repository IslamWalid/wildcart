const crypto = require('crypto');

const { Customer, Order } = require('../models');

async function createOrder(customerId, productId, order) {
  await Order.create({
    id: crypto.randomUUID(),
    customerId,
    productId,
    status: 'pending',
    quantity: order.quantity,
    unitPrice: order.unitPrice,
    totalPrice: order.totalPrice
  });
}

async function retrieveCustomerOrders(customerId) {
  const customer = await Customer.findByPk(customerId, {
    attributes: [],
    include: Order
  });

  return customer ? customer.orders : null;
}

async function retrieveOrder(customerId, orderId) {
  return await Order.findOne({
    where: {
      customerId,
      orderId
    }
  });
}

async function updateOrder(user, orderId, order) {
  // let result;
  // const { quantity, status } = order;
  //
  // if (user.userType === 'customer') {
  //   result = await Order.update({ quantity }, {
  //     where: {
  //       id: orderId,
  //       customerId: user.id
  //     }
  //   });
  // } else {
  //   result = await Order.update()
  // }
  //
  // return result[0] > 0;
}

async function deleteOrder(customerId, orderId) {
  await Order.destroy({
    where: {
      customerId,
      id: orderId
    }
  });
}

module.exports = {
  createOrder,
  retrieveCustomerOrders,
  retrieveOrder,
  updateOrder,
  deleteOrder
};
