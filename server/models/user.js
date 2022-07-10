let users = require('../db/users.json') || [];

class User {
  constructor(id, username, password) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.lastLogin = "";
    this.token = "";
  }

  save() {
    this.id = users.length + 1;
    users.push(this);
    return this;
  }

  update() {
    const index = users.findIndex(u => u.id == this.id);
    if (index >= 0) {
      users.splice(index, 1, this);
      return this;
    } else {
      return { error: `Not found user ${this.id}` };
    }
  }

  static getMe(token) {
    if (token) {
      const me = users.find(u => u.token === token);
      if (me) {
        return me;
      } else {
        return { error: 'User not found.' };
      }
    } else {
      return { error: 'Invalid toke.' };
    }
  }

  static login(username, password) {
    const index = users.findIndex(u => u.username === username);
    if (index >= 0) {
      const user = users[index];
      if (user.password === password) {
        //username and password is match => generate token: username + Date.now()
        const loginTime = new Date();
        const token = `${user.username}$${user.id}$${loginTime.getTime()}`;
        //save to user
        user.lastLogin = loginTime;
        user.token = token;
        users.splice(index, 1, user);
        return { accessToken: token };
      } else {
        return { error: 'Password does not match.' };
      }
    } else {
      return { error: `User ${this.username} does not exist.`}
    }
  }

  static authorization(authorization) {
    //check token for all other API
    //Header: 'authorization: bearer token'
    if (authorization) {
      const token = authorization.replace(/bearer /ig, '');
      if (token !== 'null') {
        return User.getMe(token);
      }
      else return { error: 'Invalid token.' };
    } else {
      return { error: 'Invalid token.' };
    }
  }

  static logout(authorization) {
    //has token from the client
    const token = authorization.replace(/bearer /ig, '');
    if (token === 'null') {
      return { error: 'Invalid token.' };
    } 
    const index = users.findIndex(user => user.token === token);
    if (index >= 0) {
      const loginUser = users[index];
      loginUser.token = '';
      users.splice(index, 1, loginUser);
      return { success: 1 };
    } else {
      return { error: `Not found user with token ${token}` };
    }
  }
}

module.exports = User;