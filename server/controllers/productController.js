const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  res.status(200).json(Product.fetchAll());
}

exports.getProductById = (req, res, next) => {
  res.status(200).json(Product.getProductById(req.params.id));
}

exports.update = (req, res, next) => {
  const prod = req.body;
  const updatedProd = new Product(req.params.id, prod.name, prod.price, prod.image, prod.quantity).update();
  res.status(200).json(updatedProd);
}

exports.updateQuantityById = (req, res, next) => {
  res.status(200).json(Product.updateProductQuantityById(req.params.id, req.params.quantity));
}
//use get for this case
exports.validateQuantityById = (req, res, next) => {
  res.status(200).text(Product.validateProductQuantityById(req.params.id, req.params.quantity));
}