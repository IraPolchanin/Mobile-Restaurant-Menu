import menuData from './data.json' assert {type: 'json'};
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let orderArr = [];
const checkout = document.getElementById('checkout');
const page = document.getElementById('page');
const modal = document.getElementById('modal');

const username = document.getElementById('username');
const cardnumber = document.getElementById('cardnumber');
const cardcvv = document.getElementById('cardcvv')


document.addEventListener('click', e => {
  let isInCart = orderArr.some(order => order.name === e.target.id);
  if (e.target.className === 'menu__item-btn' && !isInCart) {
    orderArr.push({ name: e.target.id, price: +e.target.dataset.price, count: 1, uuid: uuidv4() })
  } else {
    orderArr.map(order => order.name === e.target.id ? order.count++ : order)
  }

  if (e.target.className === 'order__item-remove') {
    deleteOrderItem(e.target.parentElement.dataset.order)
  }
  if (e.target.className === 'order__item-count-btn') {
    if (e.target.id.includes('minusCount')) {
      decreaseCount(e.target.parentElement.parentElement.dataset.order)
    }
    if (e.target.id.includes('plusCount')) {
      increaseCount(e.target.parentElement.parentElement.dataset.order)
    }
  }
  if (e.target.className === 'checkout__complete-btn') {
    showModal()
  }

  if (e.target.className === 'modal-close-btn') {
    closeModal()
  }

  if (e.target.className === 'modal-btn') {
    if (username.value && cardnumber.value && cardcvv.value) {
      e.preventDefault()
      finish()
    }
  }

  if (orderArr.length > 0) {
    renderOrder(orderArr)
  }
})

function finish() {
  closeModal();
  orderArr = [];
  checkout.innerHTML = `<p class="finish-text">Thanks, James! Your order is on its way!
  </p>`;

  setTimeout(()=>{
    checkout.innerHTML = ``;
  }, 3000)
}

function showModal() {
  modal.style.display = 'flex';
  page.style.overflow = 'hidden';
}

function closeModal() {
  modal.style.display = 'none';
  page.style.overflow = 'visible';
}

function decreaseCount(id) {
  orderArr.map(order => order.uuid === id ? { ...order, count: order.count-- } : order)
  orderArr = orderArr.filter(order => order.count > 0)
  if (orderArr.length < 1) {
    checkout.innerHTML = ``
  }
}

function increaseCount(id) {
  orderArr.map(order => order.uuid === id ? { ...order, count: order.count++ } : order)
}


function deleteOrderItem(id) {
  orderArr = orderArr.filter(order => order.uuid !== id);
  if (orderArr.length < 1) {
    checkout.innerHTML = ``
  }
}

function renderOrder() {
  checkout.innerHTML = `
    <div class="checkout__inner" id="total">
      <h2 class="checkout__title">Your order</h2>
      <div class="checkout__content">${getOrderItemHtml()}</div>
      <div class="checkout__total">
        <p class="order__item-title">Total Price</p>
        <p class="order__item-details">&dollar;${getTotalPrice()}</p>  
      </div>
      <button class="checkout__complete-btn">Complete order</button>
    </div>
  `
}

function getOrderItemHtml() {
  let orderItemHtml = orderArr.map((orderItem, index) => `
    <div class="order__item" data-order=${orderItem.uuid}>
      <p class="order__item-title">${orderItem.name}</p>
      <button class="order__item-remove">remove</button>
      <div class="order__item-count">
        <button class="order__item-count-btn" id="minusCount${index}">-</button>
        <p class="order__item-details order__item-details_count">${orderItem.count} pc</p>
        <button class="order__item-count-btn" id="plusCount${index}">+</button>
      </div>
      <p class="order__item-details order__item-details_price"> &dollar;${orderItem.price * orderItem.count} total</p>
    </div>
    `).join('');
  return orderItemHtml;
}

function getTotalPrice() {
  return orderArr.map(order => order.price * order.count).reduce((a, b) => a + b)
}

function getMenuHtml() {
  let menuHtml = menuData.map(menuItem => `
    <div class="menu__item">
          <span class="menu__item-pic">${menuItem.emoji}</span>
          <div class="menu__item-content">
            <p class="menu__item-title">${menuItem.name}</p>
            <p class="menu__item-ingredients">${menuItem.ingredients.join(', ')}</p>
            <p class="menu__item-price">&dollar;${menuItem.price}</p>
          </div>
          <button class="menu__item-btn" id=${menuItem.name} data-price=${menuItem.price}>+</button>
        </div>
    `).join('')
  return menuHtml;
}

function render() {
  document.getElementById('menu').innerHTML = getMenuHtml()
}

render()

