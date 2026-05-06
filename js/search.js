// Search Page Functionality

// Products are loaded from database.js
// Search by name, material, category, img filename

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
    
    // Update title with search query from URL
    const urlParams = new URLSearchParams(window.location.search);
    const titleEl = document.getElementById('searchQueryTitle');
    if (titleEl && urlParams.get('q')) {
    titleEl.textContent = '"' + decodeURIComponent(urlParams.get('q')) + '"';
    }
    
    renderProducts();
    setupFilters();
    setupPagination();
    setupSort();
    
    // Apply URL search query
    const searchQuery = urlParams.get('q') || '';
    if (searchQuery) {
    applySearch(searchQuery);
    }
});

// Helper color function
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

// Apply search query
function applySearch(query) {
    filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.material.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.img.toLowerCase().includes(query.toLowerCase())
    ).map(p => ({
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
    currentPage = 1;
    renderProducts();
    renderPagination();
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
                <img src="${product.img}" alt="${product.name}" loading="lazy" onerror="this.src='images/homelogo.png'">
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

// Add to cart from search
function addToCartFromSearch(productId, event) {
    const product = getProductById(productId);
        if (product) {
        addToCart(productId, 1);
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

// Setup Filters (filters + search)
function setupFilters() {
    // Material checkboxes
    document.querySelectorAll('.checkbox-label[data-filter="material"]').forEach(label => {
        label.addEventListener('click', function(e) {
            e.preventDefault(); e.stopPropagation();
            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            this.classList.toggle('checked', checkbox.checked);
            const filterValue = this.dataset.value;
            if (checkbox.checked) {
                if (!activeFilters.materials.includes(filterValue)) activeFilters.materials.push(filterValue);
            } else {
                activeFilters.materials = activeFilters.materials.filter(m => m !== filterValue);
            }
            applyFilters();
        });
    });
    
    // Category checkboxes
    document.querySelectorAll('.checkbox-label[data-filter="category"]').forEach(label => {
        label.addEventListener('click', function(e) {
            e.preventDefault(); e.stopPropagation();
            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            this.classList.toggle('checked', checkbox.checked);
            const filterValue = this.dataset.value;
            if (checkbox.checked) {
                if (!activeFilters.categories.includes(filterValue)) activeFilters.categories.push(filterValue);
            } else {
                activeFilters.categories = activeFilters.categories.filter(c => c !== filterValue);
            }
            applyFilters();
        });
    });
    
    // Color swatches
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.addEventListener('click', function(e) {
            e.preventDefault();
            const color = this.dataset.color;
            this.classList.toggle('active');
            if (this.classList.contains('active')) {
                if (!activeFilters.colors.includes(color)) activeFilters.colors.push(color);
            } else {
                activeFilters.colors = activeFilters.colors.filter(c => c !== color);
            }
            applyFilters();
        });
    });
    
    // Price slider
    const priceSlider = document.getElementById('priceSlider');
    if (priceSlider) {
        priceSlider.addEventListener('input', function() {
            activeFilters.maxPrice = parseInt(this.value) * 50;
            applyFilters();
        });
    }
    
    // Header search input
    const headerSearch = document.querySelector('.header-search input');
    if (headerSearch) {
        headerSearch.addEventListener('input', function() {
            applySearch(this.value);
        });
    }
}

// Apply all filters + search
function applyFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    let searchQuery = urlParams.get('q') || '';
    
    filteredProducts = products.filter(p => {
        const matchesSearch = !searchQuery || (
            p.name.toLowerCase().includes(searchQuery) ||
            p.material.toLowerCase().includes(searchQuery) ||
            p.category.toLowerCase().includes(searchQuery) ||
            p.img.toLowerCase().includes(searchQuery)
        );
        const materialMatch = activeFilters.materials.length === 0 || activeFilters.materials.some(m => p.material.toLowerCase().includes(m));
        const categoryMatch = activeFilters.categories.length === 0 || activeFilters.categories.some(c => p.category === c);
        const colorMatch = activeFilters.colors.length === 0 || activeFilters.colors.includes(getProductColor(p.category, p.material));
        const priceMatch = p.price <= activeFilters.maxPrice;
        return matchesSearch && materialMatch && categoryMatch && colorMatch && priceMatch;
    }).map(p => ({
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
    
    currentPage = 1;
    renderProducts();
    renderPagination();
}

// Pagination functions (unchanged)
function setupPagination() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    if (prevBtn) prevBtn.addEventListener('click', () => { if (currentPage > 1) { currentPage--; renderProducts(); renderPagination(); } });
    if (nextBtn) nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
        if (currentPage < totalPages) { currentPage++; renderProducts(); renderPagination(); }
    });
}

function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const numbersContainer = document.getElementById('paginationNumbers');
    if (!numbersContainer) return;
    
    let numbersHTML = '';
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        numbersHTML += `<button class="pagination-number ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    numbersContainer.innerHTML = numbersHTML;
    
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

function goToPage(page) {
    currentPage = page;
    renderProducts();
    renderPagination();
}

// Sort
function setupSort() {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) return;

    // Cache the original order once so "Featured" (relevance) is stable.
    const originalOrder = filteredProducts.slice();

    // Store last sort selection
    sortSelect.dataset.activeSort = sortSelect.value;

    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;

        // Reset to original order for relevance/featured each time.
        if (sortValue === 'relevance' || sortValue === 'best-seller' || sortValue === 'newest') {
            filteredProducts = originalOrder.slice();
        }

        switch (sortValue) {
            case 'price-low':
                // Low to high
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                // High to low
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;

            // For the other options, keep safe defaults since UI says Featured
            case 'best-seller':
                // Best sellers are not marked in this JS view; fallback to id desc
                filteredProducts.sort((a, b) => (b.id || 0) - (a.id || 0));
                break;
            case 'newest':
                // Newest fallback to id desc
                filteredProducts.sort((a, b) => (b.id || 0) - (a.id || 0));
                break;
            case 'relevance':
            default:
                // Featured/relevance: keep original order
                filteredProducts = originalOrder.slice();
                break;
        }

        currentPage = 1;
        renderProducts();
        renderPagination();
    });
}


// View product
function viewProduct(id) {
    window.location.href = 'productdetail.html?id=' + id;
}

// Global functions
window.addToCartFromSearch = addToCartFromSearch;
window.goToPage = goToPage;
window.viewProduct = viewProduct;
