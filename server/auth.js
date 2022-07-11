let users = require('./db/users.json');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.replace(/bearer /ig, '');
    const userId = token.split('$')[1];
    const user = users.filter(u => u.id == userId && u.token === token);
    if (user.length == 0) {
      throw 'Invalid user Id';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Authentication fails!')
    });
  }
};
