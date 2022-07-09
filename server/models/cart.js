let carts = require('../db/carts.json') || [];

class Cart {
  constructor(username, items = [] ) {
    this.user = username;
    this.items = items;
  }

  save() {
    carts.push(this);
    return this;
  }

  static addItemByUser(username, prodId) {
    const idx = carts.findIndex(cart => cart.user === username);
    let cart;
    if (idx >= 0) {
      cart = carts[idx];
      cart.items.push(prodId);
      carts.splice(idx, 1, cart);
    } else {
      //new cart
      cart = new Cart(username, [prodId]);
      carts.push(cart);
    }
    return cart;
  }
}

module.exports = Cart;