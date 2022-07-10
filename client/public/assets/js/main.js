window.onload = function () {
  //check authorized then loading the right content
  authorizedChecking();


  //no authenticate: show login form
  document.getElementById('loginBtn').onclick = login;
  document.getElementById('logoutBtn').onclick = logout;
}


var host = 'http://localhost:3000';

async function renderUserCart() {
  const accessToken = sessionStorage.getItem('accessToken');
  const uId = accessToken.split('$')[1];
  const cart = await fetch(`${host}/user/${uId}/cart`, {
    method: 'GET',
    cache: 'no-cache',
    headers: headersGeneration()
  }).then(response => response.json());
  if (!cart.error) {
    const contentDiv = document.getElementById('content');

    const cartDiv = document.createElement('div');
    cartDiv.id = 'cart';
    const pTitle = document.createElement('p');

    if (cart.items.length == 0) {
      pTitle.style.textTransform = 'initial';
      pTitle.innerHTML = 'There is no item in your shopping cart!';
      cartDiv.appendChild(pTitle);
    } else {
      pTitle.innerHTML = 'Your shopping cart';
      cartDiv.appendChild(pTitle);

      const grid = document.createElement('div');
      grid.className = 'grid';
      grid.id = 'cart-grid';

      const rowHead = document.createElement('div');
      rowHead.className = 'row';
      rowHead.innerHTML = `
        <div class="head cell">Name</div>
        <div class="head cell">Price</div>
        <div class="head cell">Total</div>
        <div class="head cell">Quantity</div>
      `;
      grid.appendChild(rowHead);
      let total = 0;
      cart.items.forEach(item => {
        const row = document.createElement('div');
        row.className = 'row';
        row.id = 'itemid-' + item.id;

        const divName = document.createElement('div');
        divName.className = 'cell';
        divName.innerHTML = item.name;
        row.appendChild(divName);

        const divPrice = document.createElement('div');
        divPrice.className = 'cell number unitPrice';
        divPrice.innerHTML = item.price;
        row.appendChild(divPrice);

        const divTotal = document.createElement('div');
        divTotal.className = 'cell number totalPrice';
        const totalProductPrice = parseFloat(item.price) * parseInt(item.quantity);
        divTotal.innerHTML = totalProductPrice;
        total += totalProductPrice;
        row.appendChild(divTotal);

        const divQtt = document.createElement('div');
        divQtt.className = 'cell center';
        const spanMinus = document.createElement('span');
        spanMinus.title = 'Decrease';
        
        //onclick process

        spanMinus.innerHTML = '- ';
        divQtt.appendChild(spanMinus);

        const inputMin = document.createElement('input');
        inputMin.type = 'number';
        inputMin.value = 1;
        divQtt.appendChild(inputMin);

        const spanPlus = document.createElement('span');
        spanPlus.title = 'Increase';
        
        //onclick

        spanPlus.innerHTML = ' +';
        divQtt.appendChild(spanPlus);
        row.appendChild(divQtt);

        grid.appendChild(row);
      });

      const rowTotal = document.createElement('div');
      rowTotal.className = 'row';
      rowTotal.innerHTML = `
        <div class="cell-total"></div>
        <div class="cell-total"></div>
        <div class="cell-total"></div>
        <div class="cell-total center">Total: <span id="total">${total.toFixed(2)}</span></div>
      `;
      grid.appendChild(rowTotal);
      cartDiv.appendChild(grid);

      const divCtrl = document.createElement('div');
      divCtrl.className = 'control';
      const divBtn = document.createElement('div');
      divBtn.className = 'btn';
      const btn = document.createElement('button');
      btn.className = 'button';
      btn.innerHTML = 'Place order';
      divBtn.appendChild(btn);
      divCtrl.appendChild(divBtn);
      cartDiv.appendChild(divCtrl);
    }
    
    contentDiv.appendChild(cartDiv);
  }
}

async function renderProducts() {
  const products = await fetch(`${host}/products`, {
    method: 'GET',
    cache: 'no-cache',
    headers: headersGeneration()
  }).then(response => response.json());
  if (products) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '';

    const prodDiv = document.createElement('div');
    prodDiv.id = 'products';

    const pTitle = document.createElement('p');
    pTitle.innerHTML = 'Product List';
    prodDiv.appendChild(pTitle);

    const grid = document.createElement('div');
    grid.className = 'grid';
    grid.id = 'product-grid';

    const rowHead = document.createElement('div');
    rowHead.className = 'row';
    rowHead.innerHTML = `
      <div class="head cell">Name</div>
      <div class="head cell">Price</div>
      <div class="head cell">Image</div>
      <div class="head cell">Stock</div>
      <div class="head cell">Actions</div>
    `;
    grid.appendChild(rowHead);

    products.forEach(prod => {
      const row = document.createElement('div');
      row.className = 'row';
      row.id = 'pid-' + prod.id;
      
      const divName = document.createElement('div');
      divName.className = 'cell';
      divName.innerHTML = prod.name;
      row.appendChild(divName);

      const divPrice = document.createElement('div');
      divPrice.className = 'cell number';
      divPrice.innerHTML = prod.price;
      row.appendChild(divPrice);

      const divImg = document.createElement('div');
      divImg.className = 'cell';
      divImg.innerHTML = `<img src="${host}/images/${prod.image}" alt="${prod.name}" class="product-img" />`;
      row.appendChild(divImg);

      const divQtt = document.createElement('div');
      divQtt.className = 'cell number';
      divQtt.innerHTML = prod.quantity;
      row.appendChild(divQtt);

      const divAct = document.createElement('div');
      divAct.className = 'cell';
      const icon = document.createElement('i')
      icon.className = 'fas fa-shopping-cart';
      icon.title = 'Add to cart';

      //action of icon


      divAct.appendChild(icon);
      row.appendChild(divAct);

      grid.appendChild(row);
    });

    prodDiv.appendChild(grid);

    contentDiv.appendChild(prodDiv);

    const seperate = document.createElement('div');
    seperate.style = 'margin-top: 20px;';
    seperate.innerHTML = '<hr/>';
    contentDiv.appendChild(seperate);
  }
}

function authorizedChecking() {
  fetch(`${host}/users/authorization`, {
    method: 'GET',
    cache: 'no-cache',
    headers: headersGeneration()
  }).then(response => response.json())
    .then(obj => {
      if (obj && obj.error) {
        //show login form
        console.log('error authen')
        document.getElementById('loginForm').className = 'login';
        document.getElementById('welcome').className = 'login hide';
        //show blank body
        renderWelcomeStore();
      } else {
        //show welcome form
        document.getElementById('loginForm').className = 'login hide';
        document.getElementById('loggedUser').innerHTML = obj.username;
        document.getElementById('welcome').className = 'login';
        //show product list and shopping cart

        renderProducts();
        renderUserCart();
      }
    });
}
function renderWelcomeStore() {
  const welcome = document.getElementById('welcome-store');
  if (!welcome) {
    const el = document.createElement('p');
    el.id = 'welcome-store';
    el.innerHTML = 'Welcome to my store';
    
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '';
    contentDiv.appendChild(el);
  }
}
async function login() {
  let username = document.getElementById('username').value;
  let password = document.getElementById('password').value;
  
  if (username && password) {
    let res = await fetch(`${host}/users/login`, {
      method: 'POST',
      cache: 'no-cache',
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
      document.getElementById('loggedUser').innerHTML = username;
      document.getElementById('welcome').className = 'login';

      await renderProducts();
      await renderUserCart();
    }
  } else {
    document.getElementById('loginError').innerHTML = 'Please input username and password!'
  }
}

function logout() {
  fetch(`${host}/users/logout`, {
    method: 'GET',
    headers: headersGeneration()
  }).then(response => response.json())
    .then(obj => {
      if (obj.success) {
        sessionStorage.clear();
        document.getElementById('welcome').className = 'login hide';
        document.getElementById('loginForm').className = 'login';

        const divContent = document.getElementById('content');
        renderWelcomeStore();
      } else {
        alert(obj.error);
      }
    });
}

function headersGeneration() {
  return {
    'Content-Type': 'application/json',
    'authorization': generateAuthenString()
  };
}
function generateAuthenString() {
  return 'Bearer ' + sessionStorage.getItem('accessToken');
}