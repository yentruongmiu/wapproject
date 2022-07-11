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

  static getNamesByIds(prodIds) {
    return products.filter(p => prodIds.includes(p.id))
      .map(p => p.name).join(', ');
  }

  static subtractQuantityById(prodId, quantity) {
    const index = products.findIndex(p => p.id == prodId);
    if (index >= 0) {
      const updatedProd = products[index];
      const remainQtt = parseInt(updatedProd.quantity) - parseInt(quantity);
      
      if (remainQtt >= 0) {
        updatedProd.quantity = remainQtt;
        products.splice(index, 1, updatedProd);
        return updatedProd;
      } else {
        return { error: `Product ${prodId}'s stock is not enough to subtract ${quantity}.` };
      }
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