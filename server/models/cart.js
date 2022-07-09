let carts = require('../db/carts.json') || [];

class Cart {
  constructor(user, items = [] ) {
    this.user = user;
    this.items = items;
  }

  save() {
    carts.push(this);
    return this;
  }

  static getCartByUser(user) {
    const index = carts.findIndex(cart => cart.user === user);
    if (index >= 0) {
      return carts[index];
    } else {
      const cart = new Cart(user, []);
      cart.save();
      //carts.push(cart);
      return cart;
    }
  }

  static updateCart(user, prod) {
    const index = carts.findIndex(cart => cart.user === user);
    let cart;
    if (index >= 0) {
      cart = carts[index];
      if (prod.quantity == 0) {
        //remove product out of cart
        cart.items.filter(item => item.id != prod.id);
      } else {
        cart.items.forEach(item => {
          if (item.id == prod.id) {
            item = prod;
          }
        });
      }
      
      console.log(cart);

      carts.splice(index, 1, cart);
    } else {
      //new cart
      cart = new Cart(username, [prod]);
      cart.save();
      //carts.push(cart);
    }
    return cart;
  }

  static clearCart(user) {
    const index = carts.findIndex(cart => cart.user === user);
    if (index >= 0) {
      const cart = carts[index];
      cart.items = [];
      carts.splice(index, 1, cart);
      return cart;
    } else {
      //throw new Error('Not Found');
      return { error: `Cart of user id ${user} is not inited.`}
    }
  }
}

module.exports = Cart;