const Cart = require('../models/cart');

exports.save = (req, res) => {
  const cart = req.body;
  const savedCart = new Cart(cart.userId, cart.items).save();
  res.status(200).json(savedCart);
}

exports.getCart = (req, res) => {
  res.status(200).json(Cart.getByUser(req.params.uId));
}

exports.updateCart = (req, res) => {
  const items = req.body;
  res.status(200).json(Cart.update(req.params.uId, items));
}

exports.clearCart = (req, res) => {
  res.status(200).json(Cart.clear(req.params.uId));
}

exports.addItemCart = (req, res) => {
  res.status(200).json(Cart.addItem(req.params.uId, req.body));
}

exports.subtractItemCart = (req, res) => {
  res.status(200).json(Cart.subtractItem(req.params.uId, req.body));
}