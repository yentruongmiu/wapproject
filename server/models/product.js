let products = require('../db/products.json') || [];

class Product {
  constructor(id, name, price, image, quantity) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = image;
    this.quantity = quantity;
  }

  save() {
    this.id = products.length + 1;
    products.push(this);
    return this;
  }

  update() { 
    const index = products.findIndex(p => p.id == this.id);
    if (index >= 0) {
      products.splice(index, 1, this);
      return this;
    } else {
      return { error: `Not found product ${this.id}` };
    }
  }
  
  static fetchAll() {
    return products;
  }

  static getById(prodId) {
    const index = products.findIndex(p => p.id == prodId);
    
    if (index >= 0) {
      return products[index];
    } else {
      return { error: `Not found product ${prodId}` };
    }
  }

  static updateQuantityById(prodId, quantity) {
    const index = products.findIndex(p => p.id == prodId);
    if (index >= 0) {
      const updatedProd = products[index];
      updatedProd.quantity = parseInt(quantity);
      products.splice(index, 1, updatedProd);
      return updatedProd;
    } else {
      return { error: `Not found product ${prodId}` };
    }
  }

  static validateQuantityById(prodId, quantity) {
    const index = products.findIndex(p => p.id == prodId);
    if (index >= 0) {
      const selectedProd = products[index];
      return { isValidate: selectedProd.quantity >= parseInt(quantity) ? true : false };
    } else {
      return { error: `Not found product ${prodId}` };
    }
  }
}

module.exports = Product;