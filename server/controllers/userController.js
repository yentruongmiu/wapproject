const User = require('../models/user');

exports.login = (req, res) => {
  res.status(200).json(User.login(req.body.username, req.body.password));
}

exports.logout = (req, res) => {
  res.status(200).json(User.logout(req.headers.authorization));
}

exports.authorization = (req, res) => {
  res.status(200).json(User.authorization(req.headers.authorization));
}