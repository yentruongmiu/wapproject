const User = require('../models/user');

exports.login = (req, res) => {
  res.status(200).json(User.login(req.body.username, req.body.password));
}

exports.logout = (req, res) => {
  const token = req.headers.authorization.replace(/bearer /ig, '');
  res.status(200).json(User.logout(token));
}

// exports.authenticate = (req, res) => {
//   //
// }