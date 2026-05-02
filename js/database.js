// Cart, User, Order Management Functions
const CART_KEY = 'halcyon_cart';
const USER_KEY = 'halcyon_user';
const ORDERS_KEY = 'halcyon_orders';

// Get product by ID from products array
function getProductById(id) {
    return products.find(p => p.id === id) || null;
}

function getCart() {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : { items: [], subtotal: 0 };
}

function setCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(productId, qty = 1) {
    // Get product details first
    const product = getProductById(productId);
    if (!product) {
        console.error('Product not found:', productId);
        return false;
    }
    
    const cart = getCart();
    const existing = cart.items.find(item => item.id === productId);
    
    if (existing) {
        existing.qty += qty;
    } else {
        cart.items.push({ 
            id: productId, 
            qty: qty, 
            price: product.price,
            name: product.name,
            img: product.img
        });
    }
    
    cart.subtotal = cart.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
    setCart(cart);
    updateCartBadge();
    return true;
}

function updateQuantity(productId, qty) {
    const cart = getCart();
    const item = cart.items.find(item => item.id === productId);
    if (item) {
        item.qty = qty;
        if (item.qty <= 0) {
            cart.items = cart.items.filter(i => i.id !== productId);
        }
        cart.subtotal = cart.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
        setCart(cart);
        updateCartBadge();
    }
}

function removeFromCart(productId) {
    updateQuantity(productId, 0);
}

function clearCart() {
    setCart({ items: [], subtotal: 0 });
    updateCartBadge();
}

function getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
}

function saveUser(userData) {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
}

function getOrders() {
    const orders = localStorage.getItem(ORDERS_KEY);
    return orders ? JSON.parse(orders) : [];
}

function saveOrder(orderData) {
    const orders = getOrders();
    orders.unshift(orderData);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

// Initialize demo cart with sample PHP items
function initDemoCart() {
    const demoCart = {
        items: [
            { id: 1, qty: 1, price: 62500 }, // Aurelia Sculptural Chair
            { id: 4, qty: 1, price: 62000 }  // Eames Lounge Silhouette
        ],
        subtotal: 124500
    };
    setCart(demoCart);
}

// Global cart badge updater (for header)
function updateCartBadge() {
    const cart = getCart();
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        const totalQty = cart.items.reduce((sum, item) => sum + item.qty, 0);
        badge.textContent = totalQty;
        badge.style.display = totalQty > 0 ? 'block' : 'none';
    }
}

// Auto-init cart badge after DOM ready (disabled demo cart auto-init)
document.addEventListener('DOMContentLoaded', () => {
    // Cart remains empty after items are removed - no auto-init
    updateCartBadge();
});

// Make functions globally available
window.getProductById = getProductById;
window.getCart = getCart;
window.setCart = setCart;
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.updateCartBadge = updateCartBadge;
window.initDemoCart = initDemoCart;

// Wrapper function with notification and animations (for HTML onclick handlers)
window.addItemToCart = function(productId, event) {
    var product = getProductById(productId);
    if (!product) return;
    
    // Handle event for animation source
    var sourceBtn = null;
    if (event && event.target) {
        sourceBtn = event.target.closest('.btn-add-product') || event.target.closest('.btn-add-cart') || event.target.closest('.btn-add');
        if (sourceBtn) {
            sourceBtn.classList.add('clicked');
            setTimeout(function() {
                sourceBtn.classList.remove('clicked');
            }, 200);
        }
    }
    
    // Add to cart
    addToCart(productId, 1);
    
    // Show flying animation to cart
    if (sourceBtn && typeof createFlyingCartAnimation === 'function') {
        createFlyingCartAnimation(sourceBtn);
    }
    
    // Animate cart badge
    if (typeof animateCartBadge === 'function') {
        animateCartBadge();
    }
    
    // Show notification
    if (typeof showCartNotification === 'function') {
        showCartNotification(product.name, event);
    }
};

const products = [
    // --- SOFAS & CHAIRS ---
{
        id: 1,
        name: "Aurelia Sculptural Chair",
        category: "sofas",
        price: 15995,
        material: "Bouclé Fabric",
        rating: 5,
        reviews: 48,
        img: "images/Azure-Lounge-Chair.jpg",
        badge: "NEW ARRIVAL",
        badgeClass: "badge-yellow",
    },
{
        id: 2,
        name: "Horizon Low-Profile Sofa",
        category: "sofas",
        price: 49995,
        material: "Velvet",
        rating: 4,
        reviews: 124,
        img: "images/orange sofa.jpg",
        badge: "",
        badgeClass: "",
    },
{
        id: 3,
        name: "Velvet Pivot Wing",
        category: "sofas",
        price: 12995,
        material: "Velvet",
        rating: 4,
        reviews: 67,
        img: "images/Rosé-Ottoman.jpg",
        badge: "",
        badgeClass: "",
    },
{
        id: 4,
        name: "Eames Lounge Silhouette",
        category: "sofas",
        price: 24995,
        material: "Leather",
        rating: 5,
        reviews: 210,
        img: "images/Eames-Lounge-Silhouette.jpg",
        badge: "BEST SELLER",
        badgeClass: "badge-blue",
    },

// --- TABLES ---
    {
        id: 5,
        name: "Monolith Coffee Table",
        category: "tables",
        price: 105000,
        material: "Polished Marble",
        rating: 5,
        reviews: 12,
        img: "images/decoration-table.jpg",
        badge: "LIMITED EDITION",
        badgeClass: "badge-white",
    },
    {
        id: 6,
        name: "Axis Side Table",
        category: "tables",
        price: 32500,
        material: "Solid Walnut",
        rating: 4,
        reviews: 34,
        img: "images/Cove-Oak-Side-Table.jpg",
        badge: "",
        badgeClass: "",
    },
    {
        id: 7,
        name: "Linear Sideboard",
        category: "tables",
        price: 122500,
        material: "Solid Walnut",
        rating: 5,
        reviews: 21,
        img: "images/lack-coffee-table-black-brown.jpg",
        badge: "",
        badgeClass: "",
    },
    {
        id: 8,
        name: "Prism Coffee Table",
        category: "tables",
        price: 44500,
        material: "Brushed Steel",
        rating: 5,
        reviews: 210,
        img: "images/borgeby-coffee-table-birch-veneer.jpg",
        badge: "BEST SELLER",
        badgeClass: "badge-blue",
    },

// --- LIGHTING ---
    {
        id: 9,
        name: "Halo Floor Beam",
        category: "lighting",
        price: 22500,
        material: "Brushed Steel",
        rating: 4.8,
        reviews: 55,
        img: "images/Fjord-Floor-Lamp.jpg",
        badge: "NEW ARRIVAL",
        badgeClass: "badge-yellow",
    },
    {
        id: 10,
        name: "Lumina Pendant",
        category: "lighting",
        price: 14000,
        material: "Brushed Steel",
        rating: 4.5,
        reviews: 89,
        img: "images/ARÖD-Floor-LAMP.png",
        badge: "",
        badgeClass: "",
    },
    {
        id: 11,
        name: "Aura Sculptural Lamp",
        category: "lighting",
        price: 24250,
        material: "Brushed Steel",
        rating: 5,
        reviews: 112,
        img: "images/Aura-Sculptural-Table-Lamp.jpg",
        badge: "BEST SELLER",
        badgeClass: "badge-blue",
    },

// --- DECOR ---
    {
        id: 12,
        name: "Strata Hand-Woven Rug",
        category: "decor",
        price: 44500,
        material: "Wool",
        rating: 4.9,
        reviews: 34,
        img: "images/Strata-Hand-Woven Rug.jpg",
        badge: "",
        badgeClass: "",
    },
    {
        id: 13,
        name: "Mora Glass Vase",
        category: "decor",
        price: 6000,
        material: "Glass",
        rating: 4.7,
        reviews: 18,
        img: "images/gradvis-vase-dark-.jpg",
        badge: "",
        badgeClass: "",
    },
    {
        id: 14,
        name: "Oslo Linen Cushion",
        category: "decor",
        price: 2450,
        material: "Linen",
        rating: 4.6,
        reviews: 56,
        img: "images/Cushion.jpg",
        badge: "",
        badgeClass: "",
    },

// --- OFFICE CHAIRS ---
    {
        id: 15,
        name: "Ergo Task Chair",
        category: "office-chairs",
        price: 27500,
        material: "Mesh",
        rating: 4.8,
        reviews: 230,
        img: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=600&q=80",
        badge: "BEST SELLER",
        badgeClass: "badge-blue",
    },
    {
        id: 16,
        name: "Executive Leather Seat",
        category: "office-chairs",
        price: 44500,
        material: "Solid Walnut",
        rating: 4.5,
        reviews: 41,
        img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },

    // --- BEDROOM FURNITURE ---
    {
        id: 17,
        name: "Nordic Platform Bed",
        category: "bedroom",
        price: 85000,
        material: "Solid Oak",
        rating: 5,
        reviews: 89,
        img: "https://images.unsplash.com/photo-1505693416388-b0346efee749?auto=format&fit=crop&w=600&q=80",
        badge: "BEST SELLER",
        badgeClass: "badge-blue",
    },
    {
        id: 18,
        name: "Luna Nightstand",
        category: "bedroom",
        price: 12500,
        material: "Solid Walnut",
        rating: 4.7,
        reviews: 45,
        img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },
    {
        id: 19,
        name: "Drift Dresser",
        category: "bedroom",
        price: 68000,
        material: "Solid Oak",
        rating: 4.9,
        reviews: 32,
        img: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },
    {
        id: 20,
        name: "Cloud King Mattress",
        category: "bedroom",
        price: 145000,
        material: "Memory Foam",
        rating: 4.8,
        reviews: 156,
        img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80",
        badge: "NEW ARRIVAL",
        badgeClass: "badge-yellow",
    },

    // --- STORAGE ---
    {
        id: 21,
        name: "Modular Bookshelf",
        category: "storage",
        price: 38000,
        material: "Oak Veneer",
        rating: 4.6,
        reviews: 67,
        img: "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },
    {
        id: 22,
        name: "Arc Display Cabinet",
        category: "storage",
        price: 92000,
        material: "Glass & Steel",
        rating: 4.9,
        reviews: 28,
        img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },
    {
        id: 23,
        name: "Cube Organizer",
        category: "storage",
        price: 18500,
        material: "Birch Wood",
        rating: 4.5,
        reviews: 112,
        img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },

    // --- OUTDOOR ---
    {
        id: 24,
        name: "Terra Lounge Set",
        category: "outdoor",
        price: 225000,
        material: "Weather-Resin",
        rating: 4.7,
        reviews: 43,
        img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },
    {
        id: 25,
        name: "Breeze Sun Lounger",
        category: "outdoor",
        price: 45000,
        material: "Aluminum",
        rating: 4.8,
        reviews: 76,
        img: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=600&q=80",
        badge: "NEW ARRIVAL",
        badgeClass: "badge-yellow",
    },
    {
        id: 26,
        name: "Grove Dining Table",
        category: "outdoor",
        price: 78000,
        material: "Teak",
        rating: 5,
        reviews: 34,
        img: "https://images.unsplash.com/photo-1532372576444-dda9541f4ad0?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },

    // --- KITCHEN ---
    {
        id: 27,
        name: "Chef's Kitchen Island",
        category: "kitchen",
        price: 125000,
        material: "Stainless Steel",
        rating: 4.9,
        reviews: 56,
        img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80",
        badge: "BEST SELLER",
        badgeClass: "badge-blue",
    },
    {
        id: 28,
        name: "Metro Bar Stool",
        category: "kitchen",
        price: 12500,
        material: "Leather & Steel",
        rating: 4.6,
        reviews: 89,
        img: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },
    {
        id: 29,
        name: "Culinary Cabinet",
        category: "kitchen",
        price: 185000,
        material: "Walnut & Marble",
        rating: 4.8,
        reviews: 23,
        img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },

    // --- ADDITIONAL SEATING ---
    {
        id: 30,
        name: "Coco Swivel Chair",
        category: "sofas",
        price: 38500,
        material: "Bouclé Fabric",
        rating: 4.7,
        reviews: 124,
        img: "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=600&q=80",
        badge: "NEW ARRIVAL",
        badgeClass: "badge-yellow",
    },
    {
        id: 31,
        name: "Zen Meditation Seat",
        category: "sofas",
        price: 28000,
        material: "Linen",
        rating: 4.9,
        reviews: 67,
        img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },
    {
        id: 32,
        name: "Nest Accent Chair",
        category: "sofas",
        price: 32000,
        material: "Wool Blend",
        rating: 4.6,
        reviews: 98,
        img: "https://images.unsplash.com/photo-1519961655809-34fa156820ff?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },

    // --- ADDITIONAL DECOR ---
    {
        id: 33,
        name: "Artisan Wall Mirror",
        category: "decor",
        price: 22500,
        material: "Glass & Wood",
        rating: 4.8,
        reviews: 45,
        img: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },
    {
        id: 34,
        name: "Botanical Print Set",
        category: "decor",
        price: 8500,
        material: "Art Print",
        rating: 4.5,
        reviews: 78,
        img: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },
    {
        id: 35,
        name: "Woven Basket Set",
        category: "decor",
        price: 4500,
        material: "Seagrass",
        rating: 4.7,
        reviews: 156,
        img: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },

    // --- ADDITIONAL LIGHTING ---
    {
        id: 36,
        name: "Orb Pendant Light",
        category: "lighting",
        price: 18500,
        material: "Brushed Brass",
        rating: 4.8,
        reviews: 234,
        img: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80",
        badge: "BEST SELLER",
        badgeClass: "badge-blue",
    },
    {
        id: 37,
        name: "Cascade Wall Sconce",
        category: "lighting",
        price: 14500,
        material: "Matte Black",
        rating: 4.6,
        reviews: 89,
        img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },
    {
        id: 38,
        name: "Dome Table Lamp",
        category: "lighting",
        price: 9800,
        material: "Ceramic",
        rating: 4.9,
        reviews: 167,
        img: "https://images.unsplash.com/photo-1532372576444-dda9541f4ad0?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },

    // --- ADDITIONAL TABLES ---
    {
        id: 39,
        name: "Split Console Table",
        category: "tables",
        price: 42000,
        material: "Marble & Steel",
        rating: 4.7,
        reviews: 56,
        img: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },
    {
        id: 40,
        name: "Round Bistro Table",
        category: "tables",
        price: 28500,
        material: "Tempered Glass",
        rating: 4.5,
        reviews: 89,
        img: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },
];
