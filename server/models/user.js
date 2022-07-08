let users = [];

class User {
  constructor(id, username, password) {
    this.id = id;
    this.username = username;
    this.password = password;
  }

  authenticate() {
    //
  }
}

module.exports = { User };
//using: {User} = require('user');