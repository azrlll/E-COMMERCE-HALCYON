document.addEventListener('DOMContentLoaded', () => {
    // Wait for global.js and database.js to load
    function initCheckout() {
        const cart = getCart();
        if (!cart || cart.items.length === 0) {
            window.location.href = 'cart.html';
            return;
        }

        populateOrderSummary(cart);
        initPaymentMethods();
        prefillUserDetails();
        initCompletePurchase();
    }

    function populateOrderSummary(cart) {
        const orderItemsEl = document.querySelector('.order-items');
        const subtotalEl = document.querySelector('.total-row:nth-child(1) span:last-child');
        const taxEl = document.querySelector('.total-row:nth-child(3) span:last-child');
        const finalTotalEl = document.querySelector('.final-price');

        // Map cart items to demo products (add product details)
        const itemsWithDetails = cart.items.map(item => ({
            ...item,
            img: item.id === 17 ? 'images/LYSBERG-Dining-Chair.jpg' : 'images/ARÖD-Floor-Lamp.png',
            name: item.id === 17 ? 'LYSBERG Dining Chair' : 'ARÖD Floor Lamp',
            meta: item.id === 17 ? 'OAK / NATURAL FABRIC' : 'MATTE BLACK',
            price: item.id === 17 ? 12400 : 4590
        }));

        orderItemsEl.innerHTML = itemsWithDetails.map(item => `
            <div class="order-item">
                <img src="${item.img}" alt="${item.name}" class="order-img">
                <div class="order-details">
                    <h3 class="order-name">${item.name}</h3>
                    <p class="order-meta">${item.meta}</p>
                    <div class="order-price-row">
                        <span class="order-qty">Qty: ${item.qty}</span>
                        <span class="order-price">₱${(item.price * item.qty).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        `).join('');

        const subtotal = cart.subtotal;
        const tax = Math.round(subtotal * 0.12); // 12% VAT
        const total = subtotal + tax;

        subtotalEl.textContent = `₱${subtotal.toLocaleString()}.00`;
        taxEl.textContent = `₱${tax.toLocaleString()}.80`;
        finalTotalEl.textContent = `₱${total.toLocaleString()}.80`;
    }

function initPaymentMethods() {
        const paymentCards = document.querySelectorAll('.payment-card');
        const cardForm = document.getElementById('card-form');
        const gcashForm = document.getElementById('gcash-form');
        const mayaForm = document.getElementById('maya-form');
        const paypalForm = document.getElementById('paypal-form');

paymentCards.forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                paymentCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                const method = card.dataset.method;

                // Hide all forms
                [cardForm, gcashForm, mayaForm, paypalForm].forEach(f => f.style.display = 'none');

                // Show specific form
                if (method === 'card') cardForm.style.display = 'block';
                else if (method === 'gcash') gcashForm.style.display = 'block';
                else if (method === 'maya') mayaForm.style.display = 'block';
                else if (method === 'paypal') paypalForm.style.display = 'block';
            });
        });
    }

    function prefillUserDetails() {
        const user = getUser();
        if (user) {
            document.querySelector('input[placeholder*="FIRST NAME"]').value = user.firstName || '';
            document.querySelector('input[placeholder*="LAST NAME"]').value = user.lastName || '';
            document.querySelector('input[type="email"]').value = user.email || '';
            document.querySelector('input[type="tel"]').value = user.phone || '';
            // ... other fields
        }
    }

    function initCompletePurchase() {
        const btn = document.querySelector('.btn-complete');
        btn.addEventListener('click', () => {
            if (validateForms()) {
                const orderData = collectOrderData();
                saveOrder(orderData);
                localStorage.removeItem('cart');
                alert('Order placed successfully! Thank you for shopping with Halcyon Home.');
                window.location.href = 'trackorder.html';
            }
        });
    }

    function validateForms() {
        const requiredFields = document.querySelectorAll('.form-control[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });

        // Additional validation for email, phone, card etc.
        const email = document.querySelector('input[type="email"]').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return false;
        }

        return isValid;
    }

    function collectOrderData() {
        const cart = getCart();
        const userForm = document.querySelector('.checkout-forms');
        return {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            items: cart.items,
            subtotal: cart.subtotal,
            tax: Math.round(cart.subtotal * 0.12),
            total: cart.subtotal + Math.round(cart.subtotal * 0.12),
            user: {
                firstName: userForm.querySelector('input[placeholder*="FIRST NAME"]').value,
                lastName: userForm.querySelector('input[placeholder*="LAST NAME"]').value,
                email: userForm.querySelector('input[type="email"]').value,
                phone: userForm.querySelector('input[type="tel"]').value,
                address: {
                    apartment: userForm.querySelector('input[placeholder*="APARTMENT"]').value,
                    city: userForm.querySelector('input[placeholder*="CITY"]').value,
                    postal: userForm.querySelector('input[placeholder*="POSTAL"]').value,
                    region: userForm.querySelector('select').value
                }
            },
            paymentMethod: document.querySelector('.payment-card.active .payment-name').textContent,
            status: 'pending'
        };
    }

    // Init after short delay to ensure globals loaded
setTimeout(initCheckout, 500);
});
