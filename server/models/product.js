let products = require('../db/products.json') || [];

class Product {
  constructor(name, price, image, quantity) {
    this.id = products.length + 1;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }

  update() { 
    const index = products.findIndex(p => p.id == this.id);
    if (index >= 0) {
      products.splice(index, 1, this);
      return this;
    } else {
      throw new Error("Not found");
    }
  }
  
  static fetchAll() {
    return products;
  }

  static findById(prodId) {
    const index = products.findIndex(p => p.id == prodId);
    
    if (index > -1) {
      return products[index];
    } else {
      throw new Error('Not Found');
    }
  }
}

module.exports = {
  Product
}