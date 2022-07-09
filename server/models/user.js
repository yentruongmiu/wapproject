let users = require('../db/users.json') || [];

class User {
  constructor(username, password) {
    this.id = users.length + 1;
    this.username = username;
    this.password = password;
  }

  authenticate() {
    //
  }
}

module.exports = User;