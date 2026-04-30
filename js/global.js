// Get current page name for active state
function getCurrentPage() {
    var path = window.location.pathname;
    var page = path.split('/').pop() || 'index.html';
    return page;
}

// Set navigation active state based on current page
function setNavActive() {
    var currentPage = getCurrentPage();
    var navLinks = document.querySelectorAll('.header-nav a');
    
    if (navLinks) {
        navLinks.forEach(function(link) {
            link.classList.remove('active');
            var href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            }
        });
    }
    
    // Also set account dropdown active state
    var dropdownItems = document.querySelectorAll('.dropdown-item');
    if (dropdownItems) {
        dropdownItems.forEach(function(item) {
            item.classList.remove('active');
            var href = item.getAttribute('href');
            if (href === currentPage && href !== '#') {
                item.classList.add('active');
            }
        });
    }
}

// Sidebar navigation for account pages
function showSection(section) {
    var panels = document.querySelectorAll('.account-content > section, .account-content > .panel');
    
    // Remove active class from all sidebar links
    var sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    if (sidebarLinks) {
        sidebarLinks.forEach(function(link) {
            link.classList.remove('active');
        });
    }
    
    // Add active to clicked link (if event exists)
    if (window.event && window.event.target) {
        var clicked = window.event.target.closest('a');
        if (clicked) {
            clicked.classList.add('active');
        }
    }
    
    // Show/hide panels based on section
    if (section === 'details') {
        if (panels) {
            panels.forEach(function(panel, index) {
                if (index === 0) {
                    panel.style.display = 'block';
                } else {
                    panel.style.display = 'none';
                }
            });
        }
    } else if (section === 'orders') {
        window.location.href = 'trackorder.html';
} else if (section === 'settings') {
        alert('Settings feature coming soon!');
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to log out?')) {
        localStorage.removeItem('halcyon_user');
        window.location.href = 'index.html';
    }
}

// Search functionality
function performSearch(query) {
    if (query && query.trim()) {
        window.location.href = 'search.html?query=' + encodeURIComponent(query.trim());
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    const navUl = document.querySelector('.header-nav ul');
    if (navUl) {
        navUl.classList.toggle('mobile-open');
    }
}

// Update cart badge
function updateCartBadge() {
    try {
        var cart = JSON.parse(localStorage.getItem('halcyon_cart') || '{"items":[]}');
        var badge = document.querySelector('.cart-badge');
        if (badge && cart.items) {
            badge.textContent = cart.items.length;
        }
    } catch(e) {
        console.log('Cart update error:', e);
    }
}

// Inject header and footer
document.addEventListener("DOMContentLoaded", function() {
    // Header HTML
var headerHTML = 
        '<header id="global-header">' +
            '<div class="header-left">' +
                '<div class="header-logo"><a href="index.html">HALCYON HOME</a></div>' +
                '<button class="mobile-menu-btn" onclick="toggleMobileMenu()" aria-label="Menu">' +
                    '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>' +
                '</button>' +
                '<nav class="header-nav">' +
                    '<ul>' +
                        '<li><a href="index.html">Home</a></li>' +
                        '<li><a href="categories.html">Categories</a></li>' +
                        '<li><a href="services.html">Services</a></li>' +
                        '<li><a href="aboutus.html">About Us</a></li>' +
                    '</ul>' +
                '</nav>' +
            '</div>' +
            '<div class="header-right">' +
                '<div class="header-search">' +
                    '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>' +
                    '<input type="text" placeholder="Search furniture..." id="search-input">' +
                '</div>' +
                '<div class="header-icons">' +
                    '<div class="account-wrapper">' +
                        '<button class="icon-btn" id="account-btn" aria-label="Account">' +
                            '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>' +
                        '</button>' +
                        '<div class="account-dropdown" id="account-dropdown">' +
                            '<div class="dropdown-header">' +
                                '<div class="dropdown-name">Name</div>' +
                                '<div class="dropdown-email">email</div>' +
                            '</div>' +
                            '<div class="dropdown-menu">' +
                                '<a href="details.html" class="dropdown-item">' +
                                    '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>' +
                                    '<span>Personal Details</span>' +
                                '</a>' +
                                '<a href="trackorder.html" class="dropdown-item">' +
                                    '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"></path></svg>' +
                                    '<span>Track Order</span>' +
                                '</a>' +
                                '<a href="#" class="dropdown-item logout" onclick="logout()">' +
                                    '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>' +
                                    '<span>Log Out</span>' +
                                '</a>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<a href="cart.html">' +
                        '<button class="icon-btn" aria-label="Cart">' +
                            '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>' +
                            '<span class="cart-badge">0</span>' +
                        '</button>' +
                    '</a>' +
                '</div>' +
            '</div>' +
        '</header>';
    
    // Footer HTML
    var footerHTML = 
        '<footer id="global-footer">' +
            '<div class="footer-container">' +
                '<div class="footer-grid">' +
                    '<div class="footer-col">' +
                        '<h3>HALCYON HOME</h3>' +
                        '<p style="max-width: 280px;">Curating the finest in modern living. Designed for comfort, built for life.</p>' +
                    '</div>' +
                    '<div class="footer-col">' +
                        '<h3 class="blue-header">CONTACT US</h3>' +
                        '<ul>' +
                            '<li>Address</li>' +
                            '<li>Email</li>' +
                            '<li>Phone No.</li>' +
                        '</ul>' +
                    '</div>' +
                    '<div class="footer-col">' +
                        '<h3 class="blue-header">PAYMENTS METHODS</h3>' +
                        '<div class="payment-methods">' +
                            '<img src="images/payment-method-visa.png" class="pay-icon" style="background:#1434CB; padding:4px; border-radius:4px;" alt="Visa">' +
                            '<img src="images/payment-method-mastercard.png" class="pay-icon" style="background:#000; padding:4px; border-radius:4px;" alt="Mastercard">' +
                            '<img src="images/payment-method-gcash.png" class="pay-icon" style="background:#007DFF; padding:4px; border-radius:4px;" alt="GCash">' +
                            '<img src="images/payment-method-maya.png" class="pay-icon" style="background:#111; padding:4px 8px; border-radius:5px;" alt="Maya">' +
                            '<img src="images/payment-method-paypal.png" class="pay-icon" style="padding:1px;" alt="PayPal">' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div class="footer-bottom">' +
                    '<div class="footer-links">' +
                        '<a href="#">PRIVACY</a>' +
                        '<a href="#">TERMS</a>' +
                        '<a href="#">COOKIES</a>' +
                    '</div>' +
                    '<div class="footer-copyright">&copy; 2026 HALCYON HOME. All rights reserved.</div>' +
                '</div>' +
            '</div>' +
        '</footer>';
    
    // Inject header at the top of body
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    // Inject footer at the bottom of body
    document.body.insertAdjacentHTML('beforeend', footerHTML);
    
    // Update cart badge
    updateCartBadge();
    
    // Set navigation active state
    setNavActive();
    
    // Search input handler
    var searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }
    
    // Account dropdown toggle
    var accountBtn = document.getElementById('account-btn');
    var accountDropdown = document.getElementById('account-dropdown');
    
    if (accountBtn && accountDropdown) {
        accountBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            accountDropdown.classList.toggle('show');
        });
        
        document.addEventListener('click', function(e) {
            if (!accountDropdown.contains(e.target) && !accountBtn.contains(e.target)) {
                accountDropdown.classList.remove('show');
            }
        });
    }
    
    // Make dropdown items clickable
    var dropdownItems = document.querySelectorAll('.dropdown-item');
    if (dropdownItems) {
        dropdownItems.forEach(function(item) {
            item.style.cursor = 'pointer';
            item.addEventListener('click', function() {
                var href = item.getAttribute('href');
                if (href && href !== '#' && href !== 'javascript:void(0)') {
                    window.location.href = href;
                }
            });
        });
    }
});

// Make functions available globally immediately
window.getCurrentPage = getCurrentPage;
window.setNavActive = setNavActive;
window.showSection = showSection;
window.logout = logout;
window.performSearch = performSearch;
window.updateCartBadge = updateCartBadge;
window.toggleMobileMenu = toggleMobileMenu;
