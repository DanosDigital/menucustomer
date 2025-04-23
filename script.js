
// customer.js
const firebaseConfig = {
  apiKey: "AIzaSyBkU-jdTjswxqWKHqHEEn3qvYbTZY5Wgfw",
  authDomain: "jord-5c0dd.firebaseapp.com",
  databaseURL: "https://jord-5c0dd-default-rtdb.firebaseio.com",
  projectId: "jord-5c0dd",
  storageBucket: "jord-5c0dd.firebasestorage.app",
  messagingSenderId: "33605816513",
  appId: "1:33605816513:web:e1b88173a73a324f9f0440",
  measurementId: "G-W0Z9NT40DQ"
};



// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Menu items data
const menuItems = [
  { id: 1, name: "Burger", description: "Juicy grilled burger with fresh vegetables", price: 80, image: "burger.jpg" },
  { id: 2, name: "Pizza", description: "Classic pepperoni pizza with mozzarella cheese", price: 120, image: "Pizza.jpg" },
  { id: 3, name: "Pasta", description: "Creamy Alfredo pasta with garlic bread", price: 100, image: "pasta.jpg" },
  { id: 4, name: "Salad", description: "Fresh garden salad with house dressing", price: 60, image: "salad.jpg" },
  { id: 5, name: "Ice Cream", description: "Homemade vanilla ice cream with toppings", price: 40, image: "icecream.jpg" }
];

let cart = [];

// Load menu items
function loadMenu() {
  const menuContainer = document.getElementById('menu-container');

  menuItems.forEach(item => {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="item-image">
      <div class="item-details">
        <h3 class="item-name">${item.name}</h3>
        <p class="item-description">${item.description}</p>
        <div class="item-footer">
          <span class="item-price">${item.price} ETB</span>
          <button class="add-btn" data-id="${item.id}">Add to Order</button>
        </div>
      </div>
    `;
    menuContainer.appendChild(menuItem);
  });

  // Add event listeners to buttons
  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const itemId = parseInt(e.target.getAttribute('data-id'));
      addToCart(itemId);
    });
  });
}

// Add item to cart
function addToCart(itemId) {
  const existingItem = cart.find(item => item.id === itemId);
  const menuItem = menuItems.find(item => item.id === itemId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else if (menuItem) {
    cart.push({
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: 1
    });
  }

  updateCartDisplay();
}

// Update cart display
function updateCartDisplay() {
  // Update cart count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').textContent = totalItems;

  // Update total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  document.getElementById('total-amount').textContent = total;
}

// Submit order
document.getElementById('checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  const tableId = document.getElementById('table-number').value;
  if (!tableId || tableId < 1) {
    alert('Please enter a valid table number');
    return;
  }

  const order = {
    tableId: parseInt(tableId),
    items: cart,
    total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    timestamp: Date.now()
  };

  // Push order to Firebase
  db.ref('orders').push(order)
    .then(() => {
      // Show success message
      document.getElementById('order-success').style.display = 'flex';
      // Clear cart
      cart = [];
      updateCartDisplay();
    })
    .catch(error => {
      console.error('Error submitting order:', error);
      alert('There was an error submitting your order. Please try again.');
    });
});

// Close success message
document.getElementById('close-success').addEventListener('click', () => {
  document.getElementById('order-success').style.display = 'none';
});

// Initialize when page loads
window.addEventListener('DOMContentLoaded', loadMenu);
