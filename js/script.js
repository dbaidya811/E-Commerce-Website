// Toggle Menu for Mobile View
function toggleMenu() {
    const menuItems = document.getElementById('menuItems');
    if (menuItems.style.maxHeight) {
        menuItems.style.maxHeight = null;
    } else {
        menuItems.style.maxHeight = '200px';
    }
}

// Shopping Cart Functionality
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
updateCartCount();

// Add to Cart
document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productContainer = this.closest('.col-4');
            const productName = productContainer.querySelector('h4').innerText;
            const productPrice = productContainer.querySelector('p').innerText;
            const productImage = productContainer.querySelector('img').src;
            
            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            };
            
            addToCart(product);
            showNotification(`${productName} added to cart!`);
        });
    });
    
    // Newsletter Form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('newsletter-email').value;
            showNotification(`Thank you for subscribing with ${email}!`);
            newsletterForm.reset();
        });
    }
});

// Add Product to Cart
function addToCart(product) {
    const existingProductIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingProductIndex > -1) {
        cartItems[existingProductIndex].quantity += 1;
    } else {
        cartItems.push(product);
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
}

// Update Cart Count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartCount.innerText = totalItems;
    }
}

// Show Notification
function showNotification(message) {
    // Check if notification container exists, if not create it
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
        
        // Add styles for notification container
        const style = document.createElement('style');
        style.textContent = `
            .notification-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 1000;
            }
            .notification {
                background-color: var(--primary-color);
                color: white;
                padding: 15px 20px;
                margin-top: 10px;
                border-radius: 5px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                opacity: 0;
                transform: translateY(20px);
                animation: fadeIn 0.3s forwards;
            }
            @keyframes fadeIn {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes fadeOut {
                to {
                    opacity: 0;
                    transform: translateY(20px);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Products Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the products page
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        const searchQuery = urlParams.get('search');
        
        // Filter products based on category or search query
        if (category) {
            filterProductsByCategory(category);
        } else if (searchQuery) {
            searchProducts(searchQuery);
        } else {
            loadAllProducts();
        }
    }
    
    // Cart page functionality
    const cartContainer = document.getElementById('cart-items-container');
    if (cartContainer) {
        displayCartItems();
    }
});

// Sample Products Data (in a real application, this would come from a database)
const products = [
    {
        id: 1,
        name: 'Red Printed T-Shirt',
        price: '$50.00',
        image: 'https://i.pinimg.com/736x/92/f0/6e/92f06e087c08711bc9b6a5f4437e0c79.jpg',
        category: 'fashion'
    },
    {
        id: 2,
        name: 'HRX Sports Shoes',
        price: '$75.00',
        image: 'images/product-2.jpg',
        category: 'fashion'
    },
    {
        id: 3,
        name: 'Casual Pants',
        price: '$45.00',
        image: 'images/product-3.jpg',
        category: 'fashion'
    },
    {
        id: 4,
        name: 'Blue Printed T-Shirt',
        price: '$55.00',
        image: 'https://i.pinimg.com/736x/dd/1d/d1/dd1dd11665ed9eb877f0d16da35df193.jpg',
        category: 'fashion'
    },
    {
        id: 5,
        name: 'Smart Watch',
        price: '$120.00',
        image: 'https://i.pinimg.com/736x/12/65/f1/1265f16f2deffb547e5878218679dd26.jpg',
        category: 'electronics'
    },
    {
        id: 6,
        name: 'Wireless Earbuds',
        price: '$80.00',
        image: 'https://i.pinimg.com/736x/6f/09/ad/6f09ad7bc17beab600a89e3112455b14.jpg',
        category: 'electronics'
    },
    {
        id: 7,
        name: 'Kitchen Blender',
        price: '$65.00',
        image: 'https://i.pinimg.com/736x/6d/f0/21/6df0214489c261fe04f64e9012982a20.jpg',
        category: 'home'
    },
    {
        id: 8,
        name: 'Coffee Maker',
        price: '$95.00',
        image: 'https://i.pinimg.com/736x/34/7b/9a/347b9ac18c23e758c363f3ab183d98cb.jpg',
        category: 'home'
    }
];

// Filter Products by Category
function filterProductsByCategory(category) {
    const productsContainer = document.getElementById('products-container');
    const filteredProducts = products.filter(product => product.category === category);
    
    // Update category title
    const categoryTitle = document.getElementById('category-title');
    if (categoryTitle) {
        categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    }
    
    displayProducts(filteredProducts, productsContainer);
}

// Search Products
function searchProducts(query) {
    const productsContainer = document.getElementById('products-container');
    const searchResults = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase())
    );
    
    // Update search results title
    const categoryTitle = document.getElementById('category-title');
    if (categoryTitle) {
        categoryTitle.textContent = `Search Results for "${query}"`;
    }
    
    displayProducts(searchResults, productsContainer);
}

// Load All Products
function loadAllProducts() {
    const productsContainer = document.getElementById('products-container');
    displayProducts(products, productsContainer);
}

// Display Products
function displayProducts(productsArray, container) {
    container.innerHTML = '';
    
    if (productsArray.length === 0) {
        container.innerHTML = '<p class="no-results">No products found</p>';
        return;
    }
    
    productsArray.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'col-4';
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h4>${product.name}</h4>
            <div class="rating">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star-half-alt"></i>
                <i class="far fa-star"></i>
            </div>
            <p>${product.price}</p>
            <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
        `;
        container.appendChild(productElement);
    });
    
    // Add event listeners to new buttons
    const addToCartButtons = container.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const product = products.find(p => p.id == productId);
            
            if (product) {
                addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
                showNotification(`${product.name} added to cart!`);
            }
        });
    });
}

// Display Cart Items
function displayCartItems() {
    const cartContainer = document.getElementById('cart-items-container');
    const totalPriceElement = document.getElementById('cart-total-price');
    
    if (!cartContainer) return;
    
    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        if (totalPriceElement) totalPriceElement.textContent = '$0.00';
        return;
    }
    
    cartContainer.innerHTML = '';
    let totalPrice = 0;
    
    cartItems.forEach(item => {
        const price = parseFloat(item.price.replace('$', ''));
        const itemTotal = price * item.quantity;
        totalPrice += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <p>${item.price} × ${item.quantity}</p>
                    <p class="item-total">$${itemTotal.toFixed(2)}</p>
                </div>
            </div>
            <div class="cart-item-actions">
                <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                <button class="remove-btn" data-id="${item.id}">×</button>
            </div>
        `;
        cartContainer.appendChild(cartItemElement);
    });
    
    // Update total price
    if (totalPriceElement) {
        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
    }
    
    // Add event listeners for cart actions
    const quantityButtons = document.querySelectorAll('.quantity-btn');
    const removeButtons = document.querySelectorAll('.remove-btn');
    
    quantityButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const action = this.getAttribute('data-action');
            updateCartItemQuantity(productId, action);
        });
    });
    
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            removeCartItem(productId);
        });
    });
}

// Update Cart Item Quantity
function updateCartItemQuantity(productId, action) {
    const itemIndex = cartItems.findIndex(item => item.id == productId);
    
    if (itemIndex > -1) {
        if (action === 'increase') {
            cartItems[itemIndex].quantity += 1;
        } else if (action === 'decrease') {
            cartItems[itemIndex].quantity -= 1;
            
            if (cartItems[itemIndex].quantity <= 0) {
                cartItems.splice(itemIndex, 1);
            }
        }
        
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartCount();
        displayCartItems();
    }
}

// Remove Cart Item
function removeCartItem(productId) {
    const itemIndex = cartItems.findIndex(item => item.id == productId);
    
    if (itemIndex > -1) {
        const removedItem = cartItems[itemIndex];
        cartItems.splice(itemIndex, 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartCount();
        displayCartItems();
        showNotification(`${removedItem.name} removed from cart`);
    }
}

// Checkout Function
function checkout() {
    if (cartItems.length === 0) {
        showNotification('Your cart is empty');
        return;
    }
    
    // In a real application, this would redirect to a payment gateway
    showNotification('Proceeding to checkout...');
    setTimeout(() => {
        // Clear cart after successful checkout
        cartItems = [];
        localStorage.removeItem('cartItems');
        updateCartCount();
        displayCartItems();
        showNotification('Thank you for your purchase!');
    }, 2000);
}

// Initialize checkout button if it exists
document.addEventListener('DOMContentLoaded', function() {
    const checkoutButton = document.getElementById('checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', checkout);
    }
});
