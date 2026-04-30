// Cart, User, Order Management Functions
const CART_KEY = 'halcyon_cart';
const USER_KEY = 'halcyon_user';
const ORDERS_KEY = 'halcyon_orders';

function getCart() {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : { items: [], subtotal: 0 };
}

function setCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(productId, qty = 1, price = 0) {
    const cart = getCart();
    const existing = cart.items.find(item => item.id === productId);
    
    if (existing) {
        existing.qty += qty;
    } else {
        cart.items.push({ id: productId, qty, price });
    }
    
    cart.subtotal = cart.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
    setCart(cart);
    updateCartBadge();
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

// Initialize demo cart matching checkout demo (LYSBERG id=17, ARÖD id=18, prices in PHP)
function initDemoCart() {
    const demoCart = {
        items: [
            { id: 17, qty: 2, price: 6200 }, // LYSBERG x2 = 12400
            { id: 18, qty: 1, price: 4590 }  // ARÖD x1 = 4590
        ],
        subtotal: 16990
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

// Auto-init demo cart and update badge after DOM ready
document.addEventListener('DOMContentLoaded', () => {
    if (getCart().items.length === 0) {
        initDemoCart();
    }
    updateCartBadge();
});

const products = [
    // --- SOFAS & CHAIRS ---
    {
        id: 1,
        name: "Aurelia Sculptural Chair",
        category: "sofas",
        price: 1250,
        material: "Bouclé Fabric",
        rating: 5,
        reviews: 48,
        img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80",
        badge: "NEW ARRIVAL",
        badgeClass: "badge-yellow",
    },
    {
        id: 2,
        name: "Horizon Low-Profile Sofa",
        category: "sofas",
        price: 3800,
        material: "Velvet",
        rating: 4,
        reviews: 124,
        img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },
    {
        id: 3,
        name: "Velvet Pivot Wing",
        category: "sofas",
        price: 1100,
        material: "Velvet",
        rating: 4,
        reviews: 67,
        img: "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },
    {
        id: 4,
        name: "Eames Lounge Silhouette",
        category: "sofas",
        price: 1240,
        material: "Leather",
        rating: 5,
        reviews: 210,
        img: "https://images.unsplash.com/photo-1519961655809-34fa156820ff?auto=format&fit=crop&w=600&q=80",
        badge: "BEST SELLER",
        badgeClass: "badge-blue",
    },

    // --- TABLES ---
    {
        id: 5,
        name: "Monolith Coffee Table",
        category: "tables",
        price: 2100,
        material: "Polished Marble",
        rating: 5,
        reviews: 12,
        img: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=600&q=80",
        badge: "LIMITED EDITION",
        badgeClass: "badge-white",
    },
    {
        id: 6,
        name: "Axis Side Table",
        category: "tables",
        price: 650,
        material: "Solid Walnut",
        rating: 4,
        reviews: 34,
        img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },
    {
        id: 7,
        name: "Linear Sideboard",
        category: "tables",
        price: 2450,
        material: "Solid Walnut",
        rating: 5,
        reviews: 21,
        img: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },
    {
        id: 8,
        name: "Prism Coffee Table",
        category: "tables",
        price: 890,
        material: "Brushed Steel",
        rating: 5,
        reviews: 210,
        img: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=600&q=80",
        badge: "BEST SELLER",
        badgeClass: "badge-blue",
    },

    // --- LIGHTING ---
    {
        id: 9,
        name: "Halo Floor Beam",
        category: "lighting",
        price: 450,
        material: "Brushed Steel",
        rating: 4.8,
        reviews: 55,
        img: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80",
        badge: "NEW ARRIVAL",
        badgeClass: "badge-yellow",
    },
    {
        id: 10,
        name: "Lumina Pendant",
        category: "lighting",
        price: 280,
        material: "Brushed Steel",
        rating: 4.5,
        reviews: 89,
        img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },
    {
        id: 11,
        name: "Aura Sculptural Lamp",
        category: "lighting",
        price: 485,
        material: "Brushed Steel",
        rating: 5,
        reviews: 112,
        img: "https://images.unsplash.com/photo-1532372576444-dda9541f4ad0?auto=format&fit=crop&w=600&q=80",
        badge: "BEST SELLER",
        badgeClass: "badge-blue",
    },

    // --- DECOR ---
    {
        id: 12,
        name: "Strata Hand-Woven Rug",
        category: "decor",
        price: 890,
        material: "Wool",
        rating: 4.9,
        reviews: 34,
        img: "https://images.unsplash.com/photo-1562582664-8a8803c031ca?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },
    {
        id: 13,
        name: "Mora Glass Vase",
        category: "decor",
        price: 120,
        material: "Glass",
        rating: 4.7,
        reviews: 18,
        img: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },
    {
        id: 14,
        name: "Oslo Linen Cushion",
        category: "decor",
        price: 49,
        material: "Linen",
        rating: 4.6,
        reviews: 56,
        img: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },

    // --- OFFICE CHAIRS ---
    {
        id: 15,
        name: "Ergo Task Chair",
        category: "office-chairs",
        price: 550,
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
        price: 890,
        material: "Solid Walnut",
        rating: 4.5,
        reviews: 41,
        img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=600&q=80",
        badge: "",
        badgeClass: "",
    },
];
