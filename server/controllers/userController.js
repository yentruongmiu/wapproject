const User = require('../models/user');

exports.login = (req, res) => {
  res.status(200).json(User.login(req.body.username, req.body.password));
}

exports.logout = (req, res) => {
  res.status(200).json(User.logout(req.headers.authorization));
}

exports.authentication = (req, res) => {
  res.status(200).json(User.authentication(req.headers.authorization));
}