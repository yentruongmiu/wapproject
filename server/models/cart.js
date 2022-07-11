let carts = require('../db/carts.json') || [];

class Cart {
  constructor(userId, items = [] ) {
    this.userId = userId;
    this.items = items;
  }

  save() {
    carts.push(this);
    return this;
  }

  static getByUser(userId) {
    const index = carts.findIndex(cart => cart.userId == userId);
    if (index >= 0) {
      return carts[index];
    } else {
      const cart = new Cart(userId, []);
      cart.save();
      return cart;
    }
  }

  static addItem(userId, prod) {
    const index = carts.findIndex(cart => cart.userId == userId);
    prod = { ...prod, id: parseInt(prod.id) };
    let cart;
    if (index >= 0) {
      cart = carts[index];
      const items = cart.items.map(item => {
        if (item.id == prod.id) {
          const qtt = parseInt(prod.quantity) + parseInt(item.quantity);
          return {...item, quantity: qtt};
        } else return item;
      });
      if (!items.map(item => item.id).includes(prod.id)) {
        items.push(prod);
      }
      cart.items = items;
      carts.splice(index, 1, cart);
    } else {
      //new cart
      cart = new Cart(userId, [prod]);
      cart.save();
    }
    return cart;
  }

  static subtractItem(userId, prod) {
    const index = carts.findIndex(cart => cart.userId == userId);
    let cart;
    if (index >= 0) {
      cart = carts[index];
      if (prod.quantity == 0) {
        //remove product out of cart
        const items = cart.items.filter(item => item.id != prod.id);
        cart.items = items;
      } else {
        const items = cart.items.map(item => {
          if (item.id == prod.id) {
            return {...item, quantity: parseInt(item.quantity) - parseInt(prod.quantity)};
          } else return item;
        });
        cart.items = items;
      }
      
      carts.splice(index, 1, cart);
    } else {
      //new cart with items is empty array
      cart = new Cart(userId, []);
      
      cart.save();
    }
    return cart;
  } 

  static update(userId, prods) {
    const index = carts.findIndex(cart => cart.userId == userId);
    let cart;
    if (index >= 0) {
      cart = carts[index];
      cart.items = prods;

      carts.splice(index, 1, cart);
    } else {
      //new cart
      cart = new Cart(userId, [prod]);
      cart.save();
    }
    return cart;
  }

  static clear(userId) {
    const index = carts.findIndex(cart => cart.userId == userId);
    if (index >= 0) {
      const cart = carts[index];
      cart.items = [];
      carts.splice(index, 1, cart);
      return cart;
    } else {
      return { error: `Cart of user id ${userId} is not inited.`}
    }
  }
}

module.exports = Cart;