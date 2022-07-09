const Cart = require('../models/cart');

exports.save = (req, res) => {
  const cart = req.body;
  const savedCart = new Cart(cart.user, cart.items).save();
  res.status(200).json(savedCart);
}

exports.getCart = (req, res) => {
  res.status(200).json(Cart.getCartByUser(req.params.user));
}

exports.updateCart = (req, res) => {
  const cart = req.body;
  res.status(200).json(Cart.updateCart(req.params.user, cart.items));
}

exports.clearCart = (req, res) => {
  res.status(200).json(Cart.clearCart(req.params.user));
}