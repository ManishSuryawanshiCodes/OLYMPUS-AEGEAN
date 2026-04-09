// Cart Management
let cart = [];
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const contactForm = document.getElementById('contactForm');

// Currency symbol
const CURRENCY = '₹';

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(itemName, price) {
    const existingItem = cart.find(item => item.name === itemName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: itemName,
            price: price,
            quantity: 1,
            id: Date.now()
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification(`✅ ${itemName} added to cart!`);
    
    // Auto open cart
    openCart();
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartUI();
}

// Update item quantity
function updateQuantity(itemId, newQuantity) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        if (newQuantity > 0) {
            item.quantity = newQuantity;
        } else {
            removeFromCart(itemId);
        }
    }
    saveCart();
    updateCartUI();
}

// Update cart UI
function updateCartUI() {
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;
    
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center text-slate-500">Your cart is empty! Start ordering!</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="flex justify-between items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition border border-slate-200">
                <div class="flex-1">
                    <p class="font-semibold text-slate-900">${item.name}</p>
                    <p class="text-lg font-bold text-amber-600">${CURRENCY}${item.price.toFixed(0)}</p>
                </div>
                <div class="flex items-center gap-2">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" class="bg-slate-300 text-slate-700 px-2 py-1 rounded hover:bg-slate-400 transition font-semibold">−</button>
                    <span class="px-3 py-1 bg-amber-600 text-white rounded font-bold">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" class="bg-slate-300 text-slate-700 px-2 py-1 rounded hover:bg-slate-400 transition font-semibold">+</button>
                </div>
                <button onclick="removeFromCart(${item.id})" class="ml-2 text-red-500 hover:text-red-700 text-lg transition">🗑️</button>
            </div>
        `).join('');
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartTotal').textContent = `${CURRENCY}${total.toFixed(0)}`;
}

// Open cart modal
function openCart() {
    cartModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close cart modal
function closeCart() {
    cartModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('❌ Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemsList = cart.map(item => `${item.quantity}x ${item.name}`).join(', ');
    
    showNotification(`🎉 Order placed! Total: ${CURRENCY}${total.toFixed(0)}`);
    console.log('Order Details:', {
        items: cart,
        total: total,
        currency: CURRENCY,
        location: 'Fontainhas, Goa',
        timestamp: new Date().toISOString()
    });
    
    // Clear cart and close modal
    setTimeout(() => {
        cart = [];
        saveCart();
        updateCartUI();
        closeCart();
    }, 1500);
}

// Scroll to menu
function scrollToMenu() {
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}

// Show notification with smooth animation
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        animation: slideInUp 0.3s ease-out;
        font-weight: 500;
        max-width: 300px;
        border-left: 4px solid #b45309;
        color: #1e293b;
        font-size: 0.95rem;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInDown 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Contact form submission
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = this.elements[0].value;
        const email = this.elements[1].value;
        const message = this.elements[2].value;
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('❌ Please enter a valid email!');
            return;
        }
        
        // Validate name
        if (name.trim().length < 2) {
            showNotification('❌ Please enter a valid name!');
            return;
        }
        
        // Validate message
        if (message.trim().length < 5) {
            showNotification('❌ Please write a message (at least 5 characters)!');
            return;
        }
        
        // Log form data (no backend)
        console.log('Contact Form Submission:', {
            name: name,
            email: email,
            message: message,
            location: 'Fontainhas, Goa',
            timestamp: new Date().toISOString()
        });
        
        showNotification('✅ Thank you! We\'ll be in touch soon!');
        this.reset();
    });
}

// Cart button click handler
if (cartBtn) {
    cartBtn.addEventListener('click', openCart);
}

// Close cart when clicking outside
if (cartModal) {
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            closeCart();
        }
    });
}

// Close cart with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !cartModal.classList.contains('hidden')) {
        closeCart();
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                closeCart();
            }
        }
    });
});

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('button.md\\:hidden');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
        showNotification('📱 Mobile menu coming soon!');
    });
}

// Intersection Observer for smooth animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe menu items
document.querySelectorAll('.menu-item').forEach(item => {
    observer.observe(item);
});

// Initialize
loadCart();

// Welcome message in console
console.log(`
    🇬🇷 Welcome to Olympus Aegean Cafe 🇬🇷
    ===============================

    Minimal Greece-inspired cafe experience

    📍 Location: Fontainhas, Goa
    💰 Prices in Indian Rupees (₹)
    ☕ Greek coffee and cafe menu
    ⭐ Quality and freshness guaranteed

    Tip: Try ordering our signature cafe classics!
    All cart data is saved locally.

    Kalimera! (Good morning!) ☀️
`);

// Performance monitoring
window.addEventListener('load', function() {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`✓ Page loaded in ${pageLoadTime}ms`);
});

// Random recommendation
function getRecommendation() {
    const recommendations = [
        '☕ Try our Greek Freddo Espresso!',
        '🥐 Spanakopita Slice is baked fresh daily!',
        '🥣 Aegean Breakfast Bowl is light and wholesome!',
        '🌯 Chicken Souvlaki Wrap is grilled to perfection!',
        '🥗 Santorini Greek Salad is crisp and refreshing!',
        '🍯 Baklava and Citrus Tea makes a perfect pair!',
    ];
    
    const randomIndex = Math.floor(Math.random() * recommendations.length);
    return recommendations[randomIndex];
}

// Add recommendation on page load
window.addEventListener('load', function() {
    console.log(`💡 Recommendation: ${getRecommendation()}`);
});
