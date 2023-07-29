const crypto = require('crypto');

const { Customer, Order, sequelize } = require('../models');

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

async function retrieveCustomerOrders(customerId) {
  const customer = await Customer.findByPk(customerId, {
    attributes: [],
    include: Order,
    raw: true,
    nest: true
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
      id: orderId,
      customerId
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
