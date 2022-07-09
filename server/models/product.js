let products = require('../db/products.json') || [];

class Product {
  constructor(id, name, price, image, quantity) {
    this.id = id;
    this.name = name;
    this.price = price;
    // /resources/images/imagename.ext
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
      throw new Error("Not Found");
    }
  }
  
  static fetchAll() {
    return products;
  }

  static getProductById(prodId) {
    const index = products.findIndex(p => p.id == prodId);
    
    if (index >= 0) {
      return products[index];
    } else {
      throw new Error('Not Found');
    }
  }

  static updateProductQuantityById(prodId, quantity) {
    const index = products.findIndex(p => p.id == prodId);
    if (index >= 0) {
      const updatedProd = products[index];
      updatedProd.quantity = parseInt(quantity);
      products.splice(index, 1, updatedProd);
      return updatedProd;
    } else {
      throw new Error('Not Found');
    }
  }

  static validateProductQuantityById(prodId, quantity) {
    const index = products.findIndex(p => p.id == prodId);
    if (index >= 0) {
      const selectedProd = products[index];
      return selectedProd.quantity >= quantity ? 1 : 0;
    } else {
      throw new Error('Not Found');
    }
  }
}

module.exports = Product;