const Cart = require('../models/cart');

exports.save = (req, res) => {
  const cart = req.body;
  const savedCart = new Cart(cart.userId, cart.items).save();
  res.status(200).json(savedCart);
}

exports.getCart = (req, res) => {
  console.log('first');
  res.status(200).json(Cart.getByUser(req.params.uId));
}

exports.updateCart = (req, res) => {
  const cart = req.body;
  res.status(200).json(Cart.update(req.params.uId, cart.items));
}

exports.clearCart = (req, res) => {
  res.status(200).json(Cart.clear(req.params.uId));
}