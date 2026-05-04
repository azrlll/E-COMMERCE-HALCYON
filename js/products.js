document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("product-grid");
    if (!grid) return; // Exit if not on productlist.html
    
    // Check if products array exists, if not define it
    if (typeof products === 'undefined') {
        console.log('Products not loaded from database.js');
        grid.innerHTML = `<div style="grid-column: 1/-1; padding: 40px 0; color: #666;">Loading products...</div>`;
        return;
    }

    // 1. Get Category from URL (e.g., ?category=sofas)
    const urlParams = new URLSearchParams(window.location.search);
    const currentCategory = urlParams.get('category');

    // 2. Dynamically Update Page Title based on Category
    if (currentCategory) {
        const categoryTitles = {
            'sofas': 'Sofas & Seating',
            'tables': 'Tables & Storage',
            'lighting': 'Lighting',
            'decor': 'Decor & Accessories',
            'office-chairs': 'Office Chairs'
        };
        const activeTitle = categoryTitles[currentCategory] || 'All Products';
        const breadTitle = currentCategory ? 'ALL PRODUCTS' : 'ALL PRODUCTS';
        
        const titleEl = document.getElementById('page-title');
        const breadEl = document.getElementById('breadcrumb-current');
        
        if (titleEl) titleEl.innerText = activeTitle;
        if (breadEl) breadEl.innerText = activeTitle.toUpperCase();
    }

// 3. Render HTML Function
    const renderProducts = (data) => {
        if (data.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; padding: 40px 0; color: #666;">No products found matching your filters.</div>`;
            document.getElementById("item-count").innerText = `Showing 0 items`;
            return;
        }

grid.innerHTML = data.map(p => `
            <div class="product-card">
                <div class="product-img-wrapper">
                    <a href="productdetail.html?id=${p.id}">
                        ${p.badge ? `<span class="badge ${p.badgeClass}">${p.badge}</span>` : ''}
                        <img src="${p.img}" alt="${p.name}">
                    </a>
                </div>
                <div class="product-info-row">
                    <a href="productdetail.html?id=${p.id}">
                        <div class="product-name">${p.name}</div>
                    </a>
                    <div class="product-price">₱${p.price.toLocaleString()}</div>
                </div>
                <div class="product-material">${p.material}</div>
                <div class="product-rating">
                    <span class="filled">${'★'.repeat(Math.floor(p.rating))}</span> 
                    <span class="product-rating-count">(${p.reviews})</span>
                </div>
                <button class="btn-add-product" onclick="addItemToCart(${p.id})">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    Add to Cart
                </button>
            </div>
        `).join("");
        
        document.getElementById("item-count").innerText = `Showing ${data.length} items`;
    };

// 4. Multi-Filter Logic (Combines Category + Checkboxes + Search + Price Range)
    const filterProducts = () => {
        const checkedMaterials = Array.from(document.querySelectorAll('.filter-mat:checked')).map(cb => cb.value);
        const searchInput = document.getElementById("global-search");
        const searchQuery = searchInput ? searchInput.value.toLowerCase() : "";
        
        // Get price range values (PHP prices now range 0 - 200000)
        const priceMinSlider = document.getElementById('price-min');
        const priceMaxSlider = document.getElementById('price-max');
        const minPrice = priceMinSlider ? parseInt(priceMinSlider.value) : 0;
        const maxPrice = priceMaxSlider ? parseInt(priceMaxSlider.value) : 200000;

        const filtered = products.filter(p => {
            // Check if it matches the URL category
            const matchesCategory = !currentCategory || p.category === currentCategory;
            // Check if it matches the sidebar checkboxes
            const matchesMaterial = checkedMaterials.length === 0 || checkedMaterials.includes(p.material);
            // Check if it matches the global header search
            const matchesSearch = p.name.toLowerCase().includes(searchQuery) || p.material.toLowerCase().includes(searchQuery);
            // Check if it matches the price range
            const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
            
            return matchesCategory && matchesMaterial && matchesSearch && matchesPrice;
        });
        
        renderProducts(filtered);
    };

    // Listeners for Checkboxes
    document.querySelectorAll('.filter-mat').forEach(cb => {
        cb.addEventListener('change', filterProducts);
    });
    
    // Listener for Global Search Bar
    setTimeout(() => {
        const searchInput = document.querySelector('.header-search input');
        if (searchInput) {
            searchInput.id = "global-search";
            searchInput.addEventListener('input', filterProducts);
        }
    }, 100);
    
    // Listen for search.html global search sync
    window.addEventListener('searchQueryUpdate', (e) => {
        document.getElementById('global-search').value = e.detail.query;
        filterProducts();
    });

    // Run filter on load to setup the page
    filterProducts();
});