const Order = require('../models/order');

exports.save = (req, res) => {
  const items = req.body;
  const savedOrder = new Order(null, req.params.uId, items).save();
  res.status(200).json(savedOrder);
}

exports.getOrders = (req, res) => {
  res.status(200).json(Order.getByUserId(req.query.uId));
}

exports.validateOrderBeforeSaving = (req, res) => {
  res.status(200).json(Order.validateBeforeSaving(req.body));
}