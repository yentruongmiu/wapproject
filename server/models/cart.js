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
    if (idx >= 0) {
      const uCart = carts[idx];
      uCart.items.push(prodId);
      carts.splice(idx, 1, uCart);
    } else {
      //new cart
      const cart = new Cart(username, [prodId]);
      carts.push(cart);
    }
  }
}