window.onload = function () {
  //check authorized then loading the right content
  authenticationChecking();

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
    pTitle.innerHTML = 'Your shopping cart';
    cartDiv.appendChild(pTitle);

    if (cart.items.length == 0) {
      const pInfo = renderNoCartItem();
      cartDiv.appendChild(pInfo);
    } else {
      let grid = document.createElement('div');
      grid.classList = 'grid';
      grid.id = 'cart-grid';
      
      grid = renderCartGrid(cart, grid);
      
      cartDiv.appendChild(grid);

      const ctrlDiv = renderCartControl();

      cartDiv.appendChild(ctrlDiv);
    }
    
    contentDiv.appendChild(cartDiv);
  }
}
function renderNoCartItem() {
  const pInfo = document.createElement('p');
  pInfo.classList = 'no-item-cart';
  pInfo.style.textTransform = 'initial';
  pInfo.innerHTML = 'There is no item in your shopping cart!';
  return pInfo;
}
async function decreaseCartItemQtt(evt) {
  const _seft = evt.target;
  const divRow = _seft.parentElement.parentElement;
  const input = _seft.nextSibling;
  const min = parseInt(input.min);
  const max = parseInt(input.max);
  let qtt = parseInt(input.value);
  //decrease
  qtt -= 1;
  const accessToken = sessionStorage.getItem('accessToken');
  const uId = accessToken.split('$')[1];
  if (qtt === 0 || max === 0) {
    //max === 0: other user buy all products then current user can not buy and he must to delete out of cart.
    //remove out cart items in server
    const cart = await fetch(`${host}/user/${uId}/cart/subtract`, {
      method: 'POST',
      headers: headersGeneration(),
      body: JSON.stringify({
        id: divRow.dataset.id,
        quantity: 0
      })
    }).then(res => res.json())
    if (cart && !cart.error) {
      //remove the line of item
      const cartGrid = document.getElementById('cart-grid');
      if (cart.items.length > 0) {
        cartGrid.innerHTML = '';
        renderCartGrid(cart, cartGrid);
      } else {
        cartGrid.remove();
        document.getElementById('cart').querySelector('.control').remove();
        const pInfo = renderNoCartItem();
        document.getElementById('cart').appendChild(pInfo);
      }
    } else {
      alert(cart.error);
    }
  } else if (qtt > min && qtt <= max) {
    const pId = divRow.dataset.id;
    //check qtt in server
    const response = await fetch(`${host}/products/${pId}/validate/${qtt}`, {
      method: 'GET',
      headers: headersGeneration()
    })
      .then(res => res.json());
    if (response && !response.error) {
      if (response.isValidate === true) {
        input.value = qtt;
        //subtract items cart in server
        fetch(`${host}/user/${uId}/cart/subtract`, {
          method: 'POST',
          headers: headersGeneration(),
          body: JSON.stringify({
            id: pId,
            quantity: 1
          })
        }).then(res => res.json())
          .then(cart => {
            //then calc other relative contents
            const cartGrid = document.getElementById('cart-grid');
            if (cart.items.length > 0) {
              cartGrid.innerHTML = '';
              renderCartGrid(cart, cartGrid);
            } else {
              cartGrid.remove();
              document.getElementById('cart').querySelector('.control').remove();
              const pInfo = renderNoCartItem();
              document.getElementById('cart').appendChild(pInfo);
            }
          });
      } else {
        const name = divRow.querySelector('.itemName').innerHTML;
        alert(`Quantity of the product ${name} exceeds the limit station in stock.`);
      }
    } else {
      alert(response.error);
    }
  }
}

async function increaseCartItemQtt(evt) {
  const _seft = evt.target;
  const input = _seft.previousSibling;
  const min = parseInt(input.min);
  const max = parseInt(input.max);
  let qtt = parseInt(input.value);
  //increase
  qtt += 1;
  if (qtt > min && qtt <= max) {
    const divRow = _seft.parentElement.parentElement;
    const pId = divRow.dataset.id;
    const accessToken = sessionStorage.getItem('accessToken');
    const uId = accessToken.split('$')[1];
    
    const response = await fetch(`${host}/products/${pId}/validate/${qtt}`, {
      method: 'GET',
      headers: headersGeneration()
    })
      .then(res => res.json());
    if (response && !response.error) {
      if (response.isValidate === true) {
        //check qtt in server
        input.value = qtt;
        //add items cart in server
        fetch(`${host}/user/${uId}/cart/add`, {
          method: 'POST',
          headers: headersGeneration(),
          body: JSON.stringify({
            id: pId,
            quantity: 1
          })
        }).then(res => res.json())
          .then(cart => {
            const cartGrid = document.getElementById('cart-grid');
            cartGrid.innerHTML = '';
            renderCartGrid(cart, cartGrid);
          });
      } else {
        const name = divRow.querySelector('.itemName').innerHTML;
        alert(`Quantity of the product ${name} exceeds the limit station in stock.`);
      }
    } else {
      alert(response.error);
    }
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
    grid.classList = 'grid';
    grid.id = 'product-grid';

    const rowHead = document.createElement('div');
    rowHead.classList = 'row';
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
      row.classList = 'row';
      row.id = 'pid-' + prod.id;
      row.dataset.id = prod.id;
      
      const divName = document.createElement('div');
      divName.classList = 'cell proName';
      divName.innerHTML = prod.name;
      row.appendChild(divName);

      const divPrice = document.createElement('div');
      divPrice.classList = 'cell number price';
      divPrice.innerHTML = prod.price.toFixed(2);
      row.appendChild(divPrice);

      const divImg = document.createElement('div');
      divImg.classList = 'cell';
      divImg.innerHTML = `<img src="${host}/images/${prod.image}" alt="${prod.name}" class="product-img" />`;
      row.appendChild(divImg);

      const divQtt = document.createElement('div');
      divQtt.classList = 'cell number stock';
      divQtt.innerHTML = prod.quantity;
      row.appendChild(divQtt);

      const divAct = document.createElement('div');
      divAct.classList = 'cell';
      const icon = document.createElement('i')
      icon.classList = 'fas fa-shopping-cart';
      icon.title = 'Add to cart';
      icon.addEventListener('click', function (evt) {
        addToCart(evt);
      });

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
async function addToCart(evt) {
  const _seft = evt.target;
  const divRow = _seft.parentElement.parentElement;
  const pId = divRow.dataset.id;
  const product = await fetch(`${host}/products/${pId}`, {
    method: 'GET',
    headers: headersGeneration()
  }).then(res => res.json());
  if (product && product.error) {
    alert(product.error);
  } else {
    if (product.quantity) {
      const item = { ...product, quantity: 1 };
      //update stock in product list
      divRow.querySelector('.stock').innerHTML = product.quantity;
      const accessToken = sessionStorage.getItem('accessToken');
      const uId = accessToken.split('$')[1];
      let qtt = !!document.getElementById(`itemid-${product.id}`);
      if (qtt) {
        qtt = 1 + parseInt(document.getElementById(`itemid-${product.id}`).querySelector('.qtt').value);
        //validate
        const response = await fetch(`${host}/products/${product.id}/validate/${qtt}`, {
          method: 'GET',
          headers: headersGeneration()
        })
          .then(res => res.json());
        if (response && !response.error) {
          if (response.isValidate === true) {
            //add product to cart
            const cart = await fetch(`${host}/user/${uId}/cart/add`, {
              method: 'POST',
              headers: headersGeneration(),
              body: JSON.stringify(item)
            }).then(res => res.json());
            if (cart && !cart.error) {
              let cartGrid = !!document.getElementById('cart-grid');
              if (!cartGrid) {
                cartGrid = document.createElement('div');
                cartGrid.classList = 'grid';
                cartGrid.id = 'cart-grid';

                const cartDiv = document.getElementById('cart');
                cartDiv.querySelector('.no-item-cart').remove();

                cartGrid = renderCartGrid(cart, cartGrid);
                cartDiv.appendChild(cartGrid);
                const ctrlDiv = renderCartControl();
                cartDiv.appendChild(ctrlDiv);
              } else {
                cartGrid = document.getElementById('cart-grid');
                cartGrid.innerHTML = '';
                renderCartGrid(cart, cartGrid);
              }
            } else {
              alert(cart.error);
            }
          } else {
            alert(`Quantity of the product ${product.name} exceeds the limit station in stock.`);
          }
        } else {
          alert(response.error);
        }
      } else {
        const cart = await fetch(`${host}/user/${uId}/cart/add`, {
          method: 'POST',
          headers: headersGeneration(),
          body: JSON.stringify(item)
        }).then(res => res.json());
        if (cart && !cart.error) {
          let cartGrid = !!document.getElementById('cart-grid');
          if (!cartGrid) {
            cartGrid = document.createElement('div');
            cartGrid.classList = 'grid';
            cartGrid.id = 'cart-grid';

            const cartDiv = document.getElementById('cart');
            cartDiv.querySelector('.no-item-cart').remove();

            cartGrid = renderCartGrid(cart, cartGrid);
            cartDiv.appendChild(cartGrid);
            const ctrlDiv = renderCartControl();
            cartDiv.appendChild(ctrlDiv);
          } else {
            cartGrid = document.getElementById('cart-grid');
            cartGrid.innerHTML = '';
            renderCartGrid(cart, cartGrid);
          }
        } else {
          alert(cart.error);
        }
      }
    } else {
      //update stock in product list
      divRow.querySelector('.stock').innerHTML = product.quantity;
      alert(`Product ${product.name} is out of stock.`);
    }
  }
}

function renderCartGrid(cart, cartGrid) {
  const rowHead = document.createElement('div');
  rowHead.classList = 'row';
  rowHead.innerHTML = `
    <div class="head cell">Name</div>
    <div class="head cell">Price</div>
    <div class="head cell">Total</div>
    <div class="head cell">Quantity</div>
  `;
  cartGrid.appendChild(rowHead);
  let total = 0;
  cart.items.forEach(item => {
    const row = document.createElement('div');
    row.classList = 'row';
    row.id = 'itemid-' + item.id;
    row.dataset.id = item.id;

    const divName = document.createElement('div');
    divName.classList = 'cell itemName';
    divName.innerHTML = item.name;
    row.appendChild(divName);

    const divPrice = document.createElement('div');
    divPrice.classList = 'cell number unitPrice';
    divPrice.innerHTML = item.price.toFixed(2);
    row.appendChild(divPrice);

    const divTotal = document.createElement('div');
    divTotal.classList = 'cell number totalPrice';
    const totalProductPrice = parseFloat(item.price) * parseInt(item.quantity);
    divTotal.innerHTML = totalProductPrice.toFixed(2);
    total += totalProductPrice;
    row.appendChild(divTotal);

    const divQtt = document.createElement('div');
    divQtt.classList = 'cell center';
    const spanMinus = document.createElement('span');
    spanMinus.title = 'Decrease';
    
    spanMinus.addEventListener('click', function (evt) {
      decreaseCartItemQtt(evt);
    });

    spanMinus.innerHTML = '- ';
    divQtt.appendChild(spanMinus);

    const inputMin = document.createElement('input');
    inputMin.type = 'number';
    inputMin.min = 0;
    inputMin.classList = 'qtt';
    const linkedProd = document.querySelector(`#pid-${item.id}`);
    const prodStock = linkedProd.querySelector('.stock').innerHTML;
    inputMin.max = prodStock;
    inputMin.value = item.quantity;
    divQtt.appendChild(inputMin);

    const spanPlus = document.createElement('span');
    spanPlus.title = 'Increase';
    
    spanPlus.addEventListener('click', function (evt) {
      increaseCartItemQtt(evt);
    });

    spanPlus.innerHTML = ' +';
    divQtt.appendChild(spanPlus);
    row.appendChild(divQtt);

    cartGrid.appendChild(row);
  });

  const rowTotal = document.createElement('div');
  rowTotal.classList = 'row';
  rowTotal.innerHTML = `
    <div class="cell-total"></div>
    <div class="cell-total"></div>
    <div class="cell-total"></div>
    <div class="cell-total center">Total: &nbsp;<span id="total">${total.toFixed(2)}</span></div>
  `;
  cartGrid.appendChild(rowTotal);
  return cartGrid;
}

function renderCartControl() {
  const ctrlDiv = document.createElement('div');
  ctrlDiv.classList = 'control';

  const orderBtnDiv = document.createElement('div');
  orderBtnDiv.classList = 'btn';

  const orderBtn = document.createElement('button');
  orderBtn.classList = 'button';
  orderBtn.innerHTML = 'Place order';

  orderBtn.addEventListener('click', function (evt) {
    placeOrder(evt);
  });
  
  orderBtnDiv.appendChild(orderBtn);
  ctrlDiv.appendChild(orderBtnDiv);
  return ctrlDiv;
}

async function placeOrder(evt) {
  //get cart
  const accessToken = sessionStorage.getItem('accessToken');
  const uId = accessToken.split('$')[1];
  const cart = await fetch(`${host}/user/${uId}/cart`, {
    method: 'GET',
    headers: headersGeneration()
  }).then(res => res.json());
  if (cart && !cart.error) {
    const order = await fetch(`${host}/orders/user/${uId}`, {
      method: 'POST',
      headers: headersGeneration(),
      body: JSON.stringify(cart.items)
    }).then(res => res.json());
    if (order && order.error) {
      alert(order.error);
      renderProducts();
      renderUserCart();
    } else {
      alert(`The order has already placed!`);
      //update product list YEN
      renderProducts();
      renderUserCart();
    }
  } else {
    alert(cart.err);
  }
}

function authenticationChecking() {
  if (sessionStorage.getItem('accessToken')) {
    fetch(`${host}/users/authentication`, {
    method: 'GET',
    cache: 'no-cache',
    headers: headersGeneration()
  }).then(response => response.json())
    .then(obj => {
      if (obj && obj.error) {
        //show login form
        document.getElementById('loginForm').classList = 'login';
        document.getElementById('welcome').classList = 'login hide';
        //show blank body
        renderWelcomeStore();
      } else {
        //show welcome form
        document.getElementById('loginForm').classList = 'login hide';
        document.getElementById('loggedUser').innerHTML = obj.username;
        document.getElementById('welcome').classList = 'login';
        //show product list and shopping cart

        renderProducts();
        renderUserCart();
      }
    }).catch(err => {
      console.log(err);
    });
  } else {
    //YEN show
    document.getElementById('loginForm').classList = 'login';
    document.getElementById('welcome').classList = 'login hide';
    //show blank body
    renderWelcomeStore();
  }
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
      
      document.getElementById('loginForm').classList = 'login hide';
      document.getElementById('loggedUser').innerHTML = username;
      document.getElementById('welcome').classList = 'login';

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
        document.getElementById('welcome').classList = 'login hide';
        document.getElementById('loginForm').classList = 'login';

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