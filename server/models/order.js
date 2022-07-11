let orders = [];
const e = require('express');
const Product = require('./product');
const Cart = require('./cart');

class Order {
  constructor(id, userId, items = []) {
    this.id = id;
    this.userId = userId;
    this.items = items;
    this.orderDate = new Date();
  }

  save() {
    let result = Order.validateBeforeSaving(this.items);
    result = result.filter(item => item.isValidate === false).map(item => item.id);
    if (result.length) {
      const names = Product.getNamesByIds(result);
      return { error: `Quantity of products ${names} exceeds the limit station in stock.`};
    } else {
      this.id = orders.length + 1;
      orders.push(this);
      this.items.forEach( prod => {
        Product.subtractQuantityById(prod.id, prod.quantity);
      });
      //clear cart
      Cart.clear(this.userId);
      return this;
    }
  }

  static validateBeforeSaving(prods) {
    const result = prods.map(prod => {
      const res = Product.validateQuantityById(prod.id, prod.quantity);
      if (res.isValidate === false) {
        return { id: prod.id, isValidate: false};
      } else {
        return { id: prod.id, isValidate: true };
      }
    });
    //[{ id: 1, isValidate: true},{ id: 2, isValidate: false}]
    return result;
  }

  static getByUserId(userId) {
    return orders.filter(od => od.userId == userId);
  }
}

module.exports = Order;