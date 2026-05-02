// Search Page Functionality

// Products are loaded from database.js (which has 40 products)
// We create a search-specific format that properly maps database fields

// State
let currentPage = 1;
const itemsPerPage = 8;
let filteredProducts = [];
let activeFilters = {
    materials: [],
    categories: ["sofas", "tables", "lighting", "decor", "office-chairs", "bedroom", "storage", "outdoor", "kitchen"],
    colors: [],
    maxPrice: 250000
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Use products from database.js (already loaded via products.js)
    if (typeof products !== 'undefined') {
        filteredProducts = products.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            category: p.category,
            material: p.material ? p.material.toLowerCase().replace(/[\s-]+/g, '-').replace(/é/g, 'e') : 'boucle',
            color: getProductColor(p.category, p.material),
            img: p.img,
            subtitle: p.material || 'Premium Material',
            stock: p.badge ? "IN STOCK" : "",
            tag: p.badge || "",
            badgeClass: p.badgeClass || ""
        }));
    }
    
    renderProducts();
    setupFilters();
    setupPagination();
    setupSort();
});

// Helper function to determine product color based on material/category
function getProductColor(category, material) {
    if (!material) return 'grey';
    const m = material.toLowerCase();
    if (m.includes('velvet') || m.includes('blue')) return 'blue';
    if (m.includes('green') || m.includes('forest')) return 'green';
    if (m.includes('black') || m.includes('charcoal')) return 'black';
    if (m.includes('terracotta') || m.includes('red') || m.includes('rose')) return 'terracotta';
    if (m.includes('white') || m.includes('cream') || m.includes('oak')) return 'grey';
    return 'grey';
}

// Render Products
function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid || filteredProducts.length === 0) {
        grid.innerHTML = '<p class="no-products">No products found. Try adjusting your filters.</p>';
        return;
    }
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageProducts = filteredProducts.slice(start, end);
    
    grid.innerHTML = pageProducts.map(product => `
        <div class="product-card" data-id="${product.id}" onclick="viewProduct(${product.id})">
            <div class="img-wrapper">
                ${product.tag ? `<span class="tag-limited">${product.tag}</span>` : ''}
                <img src="${product.img}" alt="${product.name}" onerror="this.src='images/homelogo.png'">
<button class="btn-add-cart-mini" onclick="event.stopPropagation(); addToCartFromSearch(${product.id}, event)" title="Add to Cart">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </button>
            </div>
            <div class="product-row">
                <span class="product-name">${product.name}</span>
                <span class="product-price">₱${product.price.toLocaleString()}</span>
            </div>
            <span class="product-subtitle">${product.subtitle}</span>
            ${product.stock ? `<span class="tag-stock">${product.stock}</span>` : ''}
        </div>
    `).join('');
    
    updateLoadStatus();
}

// Add to cart from search page - works with database.js functions
function addToCartFromSearch(productId, event) {
    // Get product from database.js products array
    const product = getProductById(productId);
    if (product) {
        // Use database.js addToCart function
        addToCart(productId, 1);
        showCartNotification(product.name, event);
    } else {
        console.error('Product not found:', productId);
    }
}

// Update Load Status
function updateLoadStatus() {
    const total = filteredProducts.length;
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, total);
    const statusEl = document.getElementById('loadStatus');
    const countEl = document.getElementById('resultsCount');
    if (statusEl) statusEl.textContent = `Showing ${start}-${end} of ${total} items`;
    if (countEl) countEl.textContent = `${total} pieces curated for your inquiry`;
}

// Setup Filters
function setupFilters() {
    // Material Checkbox Filters
    document.querySelectorAll('.checkbox-label[data-filter="material"]').forEach(label => {
        label.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            this.classList.toggle('checked', checkbox.checked);
            
            const filterValue = this.dataset.value;
            
            if (checkbox.checked) {
                if (!activeFilters.materials.includes(filterValue)) {
                    activeFilters.materials.push(filterValue);
                }
            } else {
                activeFilters.materials = activeFilters.materials.filter(m => m !== filterValue);
            }
            
            applyFilters();
        });
    });
    
    // Category Checkbox Filters
    document.querySelectorAll('.checkbox-label[data-filter="category"]').forEach(label => {
        label.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            this.classList.toggle('checked', checkbox.checked);
            
            const filterValue = this.dataset.value;
            
            if (checkbox.checked) {
                if (!activeFilters.categories.includes(filterValue)) {
                    activeFilters.categories.push(filterValue);
                }
            } else {
                activeFilters.categories = activeFilters.categories.filter(c => c !== filterValue);
            }
            
            applyFilters();
        });
    });
    
    // Color Swatches - Fixed toggle logic
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.addEventListener('click', function(e) {
            e.preventDefault();
            const color = this.dataset.color;
            
            // Toggle: if already active, deactivate; otherwise activate
            if (this.classList.contains('active')) {
                this.classList.remove('active');
                activeFilters.colors = activeFilters.colors.filter(c => c !== color);
            } else {
                this.classList.add('active');
                if (!activeFilters.colors.includes(color)) {
                    activeFilters.colors.push(color);
                }
            }
            
            applyFilters();
        });
    });
    
// Price Slider - Fixed for actual PHP prices
    const priceSlider = document.getElementById('priceSlider');
    const priceFill = document.getElementById('priceFill');
    const priceValue = document.getElementById('priceValue');
    
    if (priceSlider && priceFill && priceValue) {
        const min = 500;
        const max = 5000;
        
        const updatePriceDisplay = (sliderValue) => {
            // Convert slider (500-5000) to PHP price range
            // Simple mapping: slider * 50 = PHP
            const phpPrice = sliderValue * 50;
            
            const percent = ((sliderValue - min) / (max - min)) * 100;
            priceFill.style.width = percent + '%';
            priceValue.textContent = '₱' + phpPrice.toLocaleString() + '+';
            
            return phpPrice;
        };
        
        // Set initial display
        const initValue = parseInt(priceSlider.value);
        activeFilters.maxPrice = updatePriceDisplay(initValue);
        
        priceSlider.addEventListener('input', function() {
            const value = parseInt(this.value);
            activeFilters.maxPrice = updatePriceDisplay(value);
            applyFilters();
        });
    }
}

// Apply Filters
function applyFilters() {
    if (!products) return;
    
    filteredProducts = products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        material: p.material ? p.material.toLowerCase().replace(/[\s-]+/g, '-').replace(/é/g, 'e') : 'boucle',
        color: getProductColor(p.category, p.material),
        img: p.img,
        subtitle: p.material || 'Premium Material',
        stock: p.badge ? "IN STOCK" : "",
        tag: p.badge || "",
        badgeClass: p.badgeClass || ""
    })).filter(product => {
        const materialMatch = activeFilters.materials.length === 0 || activeFilters.materials.some(m => product.material && product.material.includes(m));
        const categoryMatch = activeFilters.categories.length === 0 || activeFilters.categories.includes(product.category);
        const colorMatch = activeFilters.colors.length === 0 || activeFilters.colors.includes(product.color);
        const priceMatch = product.price <= activeFilters.maxPrice;
        
        return materialMatch && categoryMatch && colorMatch && priceMatch;
    });
    
    currentPage = 1;
    renderProducts();
    renderPagination();
}

// Setup Pagination
function setupPagination() {
    renderPagination();
    
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                renderProducts();
                renderPagination();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderProducts();
                renderPagination();
            }
        });
    }
}

// Render Pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const numbersContainer = document.getElementById('paginationNumbers');
    
    if (!numbersContainer) return;
    
    let numbersHTML = '';
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
            numbersHTML += `<button class="pagination-number ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
        }
    } else {
        // Show first, last, and neighbors
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                numbersHTML += `<button class="pagination-number ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                numbersHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }
    }
    
    numbersContainer.innerHTML = numbersHTML;
    
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

// Go to Page
function goToPage(page) {
    currentPage = page;
    renderProducts();
    renderPagination();
}

// Setup Sort
function setupSort() {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        
        switch(sortValue) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'newest':
                filteredProducts.sort((a, b) => (b.badge === 'NEW ARRIVAL' ? 1 : 0) - (a.badge === 'NEW ARRIVAL' ? 1 : 0));
                break;
            case 'best-seller':
                filteredProducts.sort((a, b) => (b.badge === 'BEST SELLER' ? 1 : 0) - (a.badge === 'BEST SELLER' ? 1 : 0));
                break;
            default:
                filteredProducts.sort((a, b) => a.id - b.id);
        }
        
        currentPage = 1;
        renderProducts();
        renderPagination();
    });
}

// View Product - Navigate to product detail
function viewProduct(id) {
    window.location.href = 'productdetail.html?id=' + id;
}

// Make functions globally accessible
window.addToCartFromSearch = addToCartFromSearch;
window.goToPage = goToPage;
window.viewProduct = viewProduct;
