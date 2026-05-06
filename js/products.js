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
            'office-chairs': 'Office Chairs',
            'bedroom': 'Bedroom',
            'kitchen': 'Kitchen'
        };
        const activeTitle = categoryTitles[currentCategory] || 'All Products';
        
        const titleEl = document.getElementById('page-title');
        const breadEl = document.getElementById('breadcrumb-current');
        
        if (titleEl) titleEl.innerText = activeTitle;
        if (breadEl) breadEl.innerText = activeTitle.toUpperCase();
    }

    const ITEMS_PER_PAGE = 12;
    let currentPage = 1;

    const renderPagination = (totalPages, current) => {
        const pagination = document.querySelector('.pagination');
        if (!pagination) return;
        
        let html = '<a href="#" class="page-item page-arrow" onclick="previousPage(); return false;"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg></a>';
        
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                html += `<a href="#" class="page-item ${i === current ? 'active' : ''}" onclick="goToPage(${i}); return false;">${i}</a>`;
            }
        } else {
            html += '<a href="#" class="page-item" onclick="goToPage(1); return false;">1</a>';
            if (current > 3) html += '<span class="page-dots">...</span>';
            const startPage = Math.max(2, current - 1);
            const endPage = Math.min(totalPages - 1, current + 1);
            for (let i = startPage; i <= endPage; i++) {
                html += `<a href="#" class="page-item ${i === current ? 'active' : ''}" onclick="goToPage(${i}); return false;">${i}</a>`;
            }
            if (current < totalPages - 2) html += '<span class="page-dots">...</span>';
            html += `<a href="#" class="page-item" onclick="goToPage(${totalPages}); return false;">${totalPages}</a>`;
        }
        
        html += '<a href="#" class="page-item page-arrow" onclick="nextPage(); return false;"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></a>';
        
        pagination.innerHTML = html;
    };

    window.goToPage = (page) => {
        currentPage = page;
        filterProducts();
    };

    window.nextPage = () => {
        if (currentPage < Math.ceil(filteredData.length / ITEMS_PER_PAGE)) {
            currentPage++;
            filterProducts();
        }
    };

    window.previousPage = () => {
        if (currentPage > 1) {
            currentPage--;
            filterProducts();
        }
    };

    const renderProducts = (data) => {
        const totalItems = data.length;
        const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        const pageData = data.slice(start, end);
        
        if (pageData.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; padding: 40px 0; color: #666;">No products found matching your filters.</div>`;
            document.getElementById("item-count").innerText = `Showing 0 items`;
            renderPagination(0, 1);
            return;
        }

        grid.innerHTML = pageData.map(p => `
            <div class="product-card">
                <div class="product-img-wrapper">
                    <a href="productdetail.html?id=${p.id}">
                        ${p.badge ? `<span class="badge ${p.badgeClass}">${p.badge}</span>` : ''}
                        <img src="${p.img}" alt="${p.name}" loading="lazy">
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
                <button class="btn-add-product" onclick="addItemToCart(${p.id}, event)">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    Add to Cart
                </button>
            </div>
        `).join("");
        
        document.getElementById("item-count").innerText = `Showing ${start + 1}-${Math.min(end, totalItems)} of ${totalItems} items`;
        renderPagination(totalPages, currentPage);
    };

    const filterProducts = () => {
        const checkedMaterials = Array.from(document.querySelectorAll('.filter-mat:checked')).map(cb => cb.value);
        const searchInput = document.getElementById("global-search");
        const searchQuery = searchInput ? searchInput.value.toLowerCase() : "";
        
        const priceMinSlider = document.getElementById('price-min');
        const priceMaxSlider = document.getElementById('price-max');
        const minPrice = priceMinSlider ? parseInt(priceMinSlider.value) * 56 : 0;
        const maxPrice = priceMaxSlider ? parseInt(priceMaxSlider.value) * 56 : 280000;

        const filtered = products.filter(p => {
            const matchesCategory = !currentCategory || p.category === currentCategory;
            const matchesMaterial = checkedMaterials.length === 0 || checkedMaterials.includes(p.material);
            const matchesSearch = p.name.toLowerCase().includes(searchQuery) || p.material.toLowerCase().includes(searchQuery);
            const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
            
            return matchesCategory && matchesMaterial && matchesSearch && matchesPrice;
        });
        
        currentPage = 1; // Reset to first page on filter
        renderProducts(filtered);
    };

    // Event listeners
    document.querySelectorAll('.filter-mat').forEach(cb => cb.addEventListener('change', filterProducts));
    
    setTimeout(() => {
        const searchInput = document.querySelector('.header-search input');
        if (searchInput) {
            searchInput.id = "global-search";
            searchInput.addEventListener('input', filterProducts);
        }
    }, 100);

    // Price sliders
    const priceMinSlider = document.getElementById('price-min');
    const priceMaxSlider = document.getElementById('price-max');
    const priceMinLabel = document.getElementById('price-min-label');
    const priceMaxLabel = document.getElementById('price-max-label');
    const priceFill = document.getElementById('priceFill');
    
    const updatePriceSlider = () => {
        let minVal = parseInt(priceMinSlider.value);
        let maxVal = parseInt(priceMaxSlider.value);
        
        if (minVal > maxVal) [minVal, maxVal] = [maxVal, minVal];
        
        priceMinLabel.textContent = '₱' + (minVal * 56).toLocaleString();
        priceMaxLabel.textContent = '₱' + (maxVal * 56).toLocaleString();
        
        const minPercent = (minVal / 5000) * 100;
        priceFill.style.left = minPercent + '%';
        priceFill.style.width = ((maxVal / 5000) * 100 - minPercent) + '%';
        
        filterProducts();
    };
    
    priceMinSlider?.addEventListener('input', updatePriceSlider);
    priceMaxSlider?.addEventListener('input', updatePriceSlider);
    
    // Color swatches
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.style.cursor = 'pointer';
        swatch.addEventListener('click', () => {
            swatch.classList.toggle('active');
            filterProducts();
        });
    });
    
    // Initial load
    filterProducts();
});

