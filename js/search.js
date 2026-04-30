// Search Page Functionality

// Product Data - 25 items (5 chairs, 5 tables, 5 decoration, 5 lighting, 5 sofas)
const products = [
    // Chairs (5 items)
    { id: 1, name: "Azure Lounge Chair", price: 1240, category: "chairs", material: "boucle", color: "blue", image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=400&q=80", subtitle: "Midnight Blue Velvet", stock: "IN STOCK" },
    { id: 2, name: "Amber Swivel Shell", price: 890, category: "chairs", material: "boucle", color: "terracotta", image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=400&q=80", subtitle: "Burnt Sienna Velvet" },
    { id: 3, name: "Shadow Accent Chair", price: 1100, category: "chairs", material: "boucle", color: "black", image: "https://images.unsplash.com/photo-1519961655809-34fa156820ff?auto=format&fit=crop&w=400&q=80", subtitle: "Charcoal Heavy Velvet" },
    { id: 4, name: "Olive Dining Armchair", price: 420, category: "chairs", material: "boucle", color: "green", image: "https://images.unsplash.com/photo-1506439015525-4c6e949ff1b3?auto=format&fit=crop&w=400&q=80", subtitle: "Olive Moss Velvet" },
    { id: 5, name: "Elysian Lounge Chair", price: 1450, category: "chairs", material: "walnut", color: "grey", image: "https://images.unsplash.com/photo-1586025922924-c8e2f8e4b3a5?auto=format&fit=crop&w=400&q=80", subtitle: "Cream Bouclé" },
    
    // Tables (5 items)
    { id: 6, name: "Cove Oak Side Table", price: 550, category: "tables", material: "walnut", color: "grey", image: "https://images.unsplash.com/photo-1532372320572-cda0bc11ebe5?auto=format&fit=crop&w=400&q=80", subtitle: "Natural Oak Veneer" },
    { id: 7, name: "Borgeby Coffee Table", price: 780, category: "tables", material: "walnut", color: "green", image: "https://images.unsplash.com/photo-1533090481720-856a6e09d39b?auto=format&fit=crop&w=400&q=80", subtitle: "Birch Veneer" },
    { id: 8, name: "Guttane Coffee Table", price: 920, category: "tables", material: "walnut", color: "black", image: "https://images.unsplash.com/photo-1499933374294-0f0747a8fb12?auto=format&fit=crop&w=400&q=80", subtitle: "Oak Finish" },
    { id: 9, name: "Marble Sculptural Table", price: 2100, category: "tables", material: "marble", color: "grey", image: "https://images.unsplash.com/photo-1611269154421-4e27233f1c25?auto=format&fit=crop&w=400&q=80", subtitle: "Polished White Marble" },
    { id: 10, name: "Steel几何 Side Table", price: 380, category: "tables", material: "steel", color: "black", image: "https://images.unsplash.com/photo-1499933381432-6eml6f5f8c26?auto=format&fit=crop&w=400&q=80", subtitle: "Brushed Steel" },
    
    // Decoration (5 items)
    { id: 11, name: "Gradvis Vase", price: 180, category: "decoration", material: "steel", color: "terracotta", image: "https://images.unsplash.com/photo-1612196808214-b2f05646b91d?auto=format&fit=crop&w=400&q=80", subtitle: "Dark Ceramic" },
    { id: 12, name: "Cacstus Base Decoration", price: 220, category: "decoration", material: "marble", color: "grey", image: "https://images.unsplash.com/photo-1581539250439-9666b92d4b91?auto=format&fit=crop&w=400&q=80", subtitle: "Natural Stone" },
    { id: 13, name: "Strata Hand-Woven Rug", price: 890, category: "decoration", material: "boucle", color: "green", image: "https://images.unsplash.com/photo-1575411283557-70f1d4a975ea?auto=format&fit=crop&w=400&q=80", subtitle: "Maca Wool" },
    { id: 14, name: "Decorative Cushion Set", price: 150, category: "decoration", material: "boucle", color: "blue", image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=400&q=80", subtitle: "Blue Silk Cloth" },
    { id: 15, name: "Lindbyn Mirror", price: 340, category: "decoration", material: "steel", color: "black", image: "https://images.unsplash.com/photo-1618220174428-1a5f79738cdc?auto=format&fit=crop&w=400&q=80", subtitle: "Black Metal Frame" },
    
    // Lighting (5 items)
    { id: 16, name: "ARÖD Floor Lamp", price: 450, category: "lighting", material: "steel", color: "black", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80", subtitle: "Matte Black" },
    { id: 17, name: "Aura Sculptural Table Lamp", price: 280, category: "lighting", material: "marble", color: "grey", image: "https://images.unsplash.com/photo-1513506003901-1e6a22935782?auto=format&fit=crop&w=400&q=80", subtitle: "White Marble Base" },
    { id: 18, name: "Fjord Floor Lamp", price: 520, category: "lighting", material: "steel", color: "green", image: "https://images.unsplash.com/photo-1540932239986-301280d3d87a?auto=format&fit=crop&w=400&q=80", subtitle: "Brass Plated" },
    { id: 19, name: "Giulietta Table Lamp", price: 380, category: "lighting", material: "steel", color: "blue", image: "https://images.unsplash.com/photo-1524484488911-d9157fda962d?auto=format&fit=crop&w=400&q=80", subtitle: "Battery Operated" },
    { id: 20, name: "Stockholm Floor Lamp", price: 620, category: "lighting", material: "steel", color: "grey", image: "https://images.unsplash.com/photo-1513136123985-53d59533d09d?auto=format&fit=crop&w=400&q=80", subtitle: "White Textile Shade" },
    
    // Sofas (5 items)
    { id: 21, name: "Elysian Sofa", price: 3800, category: "sofas", material: "boucle", color: "green", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80", subtitle: "Forest Emerald Textile" },
    { id: 22, name: "Rosé Ottoman", price: 650, category: "sofas", material: "boucle", color: "blue", image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=400&q=80", subtitle: "Dusky Rose Velvet", tag: "LIMITED EDITION" },
    { id: 23, name: "Cloud Pouf", price: 210, category: "sofas", material: "boucle", color: "grey", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80", subtitle: "Cream Silk Velvet" },
    { id: 24, name: "Ruby Bedside Bench", price: 550, category: "sofas", material: "boucle", color: "terracotta", image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=400&q=80", subtitle: "Crimson Red Velvet" },
    { id: 25, name: "Smedstorp Loveseat", price: 1650, category: "sofas", material: "boucle", color: "terracotta", image: "https://images.unsplash.com/photo-1550254478-ead5cd95f42f3?auto=format&fit=crop&w=400&q=80", subtitle: "Red Brown Black" }
];

// State
let currentPage = 1;
const itemsPerPage = 8;
let filteredProducts = [...products];
let activeFilters = {
    materials: [],
    categories: ["chairs", "tables", "decoration", "lighting", "sofas"],
    colors: [],
    maxPrice: 5000
};

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    setupFilters();
    setupPagination();
    setupSort();
});

// Render Products
function renderProducts() {
    const grid = document.getElementById('productGrid');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageProducts = filteredProducts.slice(start, end);
    
    grid.innerHTML = pageProducts.map(product => `
        <div class="product-card" data-id="${product.id}" onclick="viewProduct(${product.id})">
            <div class="img-wrapper">
                ${product.tag ? `<span class="tag-limited">${product.tag}</span>` : ''}
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-row">
                <span class="product-name">${product.name}</span>
                <span class="product-price">$${product.price.toLocaleString()}</span>
            </div>
            <span class="product-subtitle">${product.subtitle}</span>
            ${product.stock ? `<span class="tag-stock">${product.stock}</span>` : ''}
        </div>
    `).join('');
    
    updateLoadStatus();
}

// Update Load Status
function updateLoadStatus() {
    const total = filteredProducts.length;
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, total);
    document.getElementById('loadStatus').textContent = `Showing ${start}-${end} of ${total} items`;
    document.getElementById('resultsCount').textContent = `${total} pieces curated for your inquiry`;
}

// Setup Filters
function setupFilters() {
    // Checkbox Filters
    document.querySelectorAll('.checkbox-label').forEach(label => {
        label.addEventListener('click', function(e) {
            e.preventDefault();
            const checkbox = this.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            this.classList.toggle('checked', checkbox.checked);
            
            const filterType = this.dataset.filter;
            const filterValue = this.dataset.value;
            
            if (checkbox.checked) {
                if (filterType === 'material') {
                    activeFilters.materials.push(filterValue);
                } else if (filterType === 'category') {
                    activeFilters.categories.push(filterValue);
                }
            } else {
                if (filterType === 'material') {
                    activeFilters.materials = activeFilters.materials.filter(m => m !== filterValue);
                } else if (filterType === 'category') {
                    activeFilters.categories = activeFilters.categories.filter(c => c !== filterValue);
                }
            }
            
            applyFilters();
        });
    });
    
    // Color Swatches
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.addEventListener('click', function() {
            this.classList.toggle('active');
            const color = this.dataset.color;
            
            if (this.classList.contains('active')) {
                activeFilters.colors.push(color);
            } else {
                activeFilters.colors = activeFilters.colors.filter(c => c !== color);
            }
            
            applyFilters();
        });
    });
    
    // Price Slider
    const priceSlider = document.getElementById('priceSlider');
    if (priceSlider) {
        priceSlider.addEventListener('input', function() {
            activeFilters.maxPrice = parseInt(this.value);
            document.getElementById('priceValue').textContent = '$' + this.value.toLocaleString() + '+';
            document.getElementById('priceFill').style.width = ((this.value - 500) / 45) + '%';
            document.getElementById('priceThumb').style.left = ((this.value - 500) / 45) + '%';
            applyFilters();
        });
    }
}

// Apply Filters
function applyFilters() {
    filteredProducts = products.filter(product => {
        const materialMatch = activeFilters.materials.length === 0 || activeFilters.materials.includes(product.material);
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
    
    document.getElementById('prevPage').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderProducts();
            renderPagination();
        }
    });
    
    document.getElementById('nextPage').addEventListener('click', function() {
        const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts();
            renderPagination();
        }
    });
}

// Render Pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const numbersContainer = document.getElementById('paginationNumbers');
    
    let numbersHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        if (totalPages <= 5 || i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            numbersHTML += `<button class="pagination-number ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            numbersHTML += `<span class="pagination-ellipsis">...</span>`;
        }
    }
    
    numbersContainer.innerHTML = numbersHTML;
    
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
}

// Go to Page
function goToPage(page) {
    currentPage = page;
    renderProducts();
    renderPagination();
}

// Setup Sort
function setupSort() {
    document.getElementById('sortSelect').addEventListener('change', function() {
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
                filteredProducts.sort((a, b) => b.id - a.id);
                break;
            case 'best-seller':
                filteredProducts.sort((a, b) => (b.sales || 0) - (a.sales || 0));
                break;
default:
                filteredProducts.sort((a, b) => a.id - b.id);
        }
        
        currentPage = 1;
        renderProducts();
        renderPagination();
    });
}

// View Product
function viewProduct(id) {
    window.location.href = 'productdetail.html?id=' + id;
}
