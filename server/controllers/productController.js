const Product = require('../models/product');

exports.getProducts = (req, res) => {
  res.status(200).json(Product.fetchAll());
}

exports.getProductById = (req, res) => {
  res.status(200).json(Product.getById(req.params.id));
}

exports.update = (req, res) => {
  const prod = req.body;
  const updatedProd = new Product(req.params.id, prod.name, prod.price, prod.image, prod.quantity).update();
  res.status(200).json(updatedProd);
}

exports.updateProductQuantityById = (req, res) => {
  res.status(200).json(Product.updateQuantityById(req.params.id, req.params.quantity));
}
//use get for this case
exports.validateProductQuantityById = (req, res) => {
  const result = Product.validateQuantityById(req.params.id, req.params.quantity);
  res.status(200).json({isValidate: result});
}

exports.save = (req, res) => {
  const prod = req.body;
  const createdProd = new Product(null, prod.name, prod.price, prod.image, prod.quantity).save();
  res.status(200).json(createdProd);
}