window.onload = function () {
  //e.preventDefault()

  //check authentication then load welcome and product list, cart list of user

  //no authenticate: show login form
  document.getElementById('loginBtn').onclick = login;
  document.getElementById('logoutBtn').onclick = logout;
}


var host = 'http://localhost:3000';

function authenticatedChecking() {
  fetch(`${host}/users/authorization`, {
    headers: {

    }
  })
}

async function login() {
  let username = document.getElementById('username').value;
  let password = document.getElementById('password').value;
  
  if (username && password) {
    let res = await fetch(`${host}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: username, password: password })
    }).then(response => response.json());

    if (res.error) {
      document.getElementById('loginError').innerHTML = res.error;
    } else {
      sessionStorage.setItem('accessToken', res.accessToken);
      document.getElementById('loginForm').className = 'login hide';
      document.getElementById('welcome').className = 'login';
    }
  } else {
    document.getElementById('loginError').innerHTML = 'Please input username and password!'
  }
}

function logout() {
  fetch(`${host}/users/logout`, {
    method: 'GET',
    headers: headerGeneration()
  }).then(response => response.json())
    .then(obj => {
      if (obj.success) {
        sessionStorage.clear();
        document.getElementById('welcome').className = 'login hide';
        document.getElementById('loginForm').className = 'login';
      } else {
        alert(obj.error);
      }
    })
}

function headerGeneration() {
  return {
    'Content-Type': 'application/json',
    'authorization': generateAuthenString()
  };
}
function generateAuthenString() {
  return 'Bearer ' + sessionStorage.getItem('accessToken');
}