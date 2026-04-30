document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("product-grid");
    if (!grid) return; // Exit if not on productlist.html
    
    // Check if products array exists, if not define it
    if (typeof products === 'undefined') {
        console.log('Products not loaded from database.js');
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
            <a href="product.html?id=${p.id}" class="product-card">
                <div class="product-img-wrapper">
                    ${p.badge ? `<span class="badge ${p.badgeClass}">${p.badge}</span>` : ''}
                    <img src="${p.img}" alt="${p.name}">
                </div>
                <div class="product-info-row">
                    <div class="product-name">${p.name}</div>
                    <div class="product-price">$${p.price.toLocaleString()}</div>
                </div>
                <div class="product-material">${p.material}</div>
                <div class="product-rating">
                    <span class="filled">${'★'.repeat(Math.floor(p.rating))}</span> 
                    <span class="product-rating-count">(${p.reviews})</span>
                </div>
            </a>
        `).join("");
        
        document.getElementById("item-count").innerText = `Showing ${data.length} items`;
    };

    // 4. Multi-Filter Logic (Combines Category + Checkboxes + Search)
    const filterProducts = () => {
        const checkedMaterials = Array.from(document.querySelectorAll('.filter-mat:checked')).map(cb => cb.value);
        const searchInput = document.getElementById("global-search");
        const searchQuery = searchInput ? searchInput.value.toLowerCase() : "";

        const filtered = products.filter(p => {
            // Check if it matches the URL category
            const matchesCategory = !currentCategory || p.category === currentCategory;
            // Check if it matches the sidebar checkboxes
            const matchesMaterial = checkedMaterials.length === 0 || checkedMaterials.includes(p.material);
            // Check if it matches the global header search
            const matchesSearch = p.name.toLowerCase().includes(searchQuery) || p.material.toLowerCase().includes(searchQuery);
            
            return matchesCategory && matchesMaterial && matchesSearch;
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

    // Run filter on load to setup the page
    filterProducts();
});