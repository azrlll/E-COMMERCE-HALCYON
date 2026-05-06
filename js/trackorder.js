// Track Order page rendering for Halcyon Home
// Reads orders from localStorage (halcyon_orders) and renders:
// - current shipment(s)
// - shows service selections (Design Consultation / White-Glove Delivery)

(function () {
    function escapeHtml(str) {
        return String(str ?? '').replace(/[&<>"']/g, function (m) {
            return ({
                '&': '&amp;',
                '<': '<',
                '>': '>',
                '"': '"',
                "'": '&#39;'
            })[m];
        });
    }

    function getOrders() {
        try {
            var raw = localStorage.getItem('halcyon_orders');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function humanDate(iso) {
        if (!iso) return '';
        try {
            var d = new Date(iso);
            if (isNaN(d.getTime())) return '';
            return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
        } catch (e) {
            return '';
        }
    }

    function getFirstProductImage(order) {
        if (!order || !Array.isArray(order.items) || order.items.length === 0) return 'images/homelogo.png';
        var first = order.items[0];
        return first.img || 'images/homelogo.png';
    }

    function buildServiceBadges(services) {
        var badges = [];
        if (!services) return badges;

        if (services.designConsultation && services.designConsultation.booked) {
            var dc = services.designConsultation;
            badges.push({
                title: 'Design Consultation',
                detail: [dc.designer && dc.designer !== 'any' ? dc.designer : 'Any available designer', dc.date ? ('• ' + humanDate(dc.date)) : '']
                    .filter(Boolean)
                    .join(' ')
            });
        }

        if (services.whiteGloveDelivery && services.whiteGloveDelivery.booked) {
            var dw = services.whiteGloveDelivery;
            badges.push({
                title: 'White-Glove Delivery',
                detail: [dw.window ? dw.window : '', dw.date ? ('• ' + humanDate(dw.date)) : '']
                    .filter(Boolean)
                    .join(' ')
            });
        }

        return badges;
    }

    function renderOrderCard(order) {
        var orderNumber = order && order.id ? String(order.id).replace('ORD-', '#HLY-') : '#HLY-ORDER';
        var status = order && order.status ? String(order.status) : 'Processing';
        var firstItem = order && Array.isArray(order.items) && order.items.length ? order.items[0] : null;

        var img = getFirstProductImage(order);
        var productTitle = firstItem ? (firstItem.name || 'Your item') : 'Your item';
        var productMeta = firstItem && firstItem.meta ? firstItem.meta : '';

        var serviceBadges = buildServiceBadges(order.services);

        var expectedArrivalText = order && order.services && order.services.whiteGloveDelivery && order.services.whiteGloveDelivery.date
            ? ('Expected Arrival: ' + humanDate(order.services.whiteGloveDelivery.date))
            : 'Expected Arrival: We will email you a schedule update.';

        var stepHtml = function (label, isActive) {
            return (
                '<div class="step' + (isActive ? ' active' : '') + '">' +
                '  <div class="step-dot"></div>' +
                '  <span class="step-label">' + escapeHtml(label) + '</span>' +
                '</div>'
            );
        };

        // Simple heuristic: if services.whiteGloveDelivery exists, show up to TRANSIT
        var transitIndex = (order && order.services && order.services.whiteGloveDelivery) ? 2 : 1;

        var steps = [
            { label: 'CONFIRMED', idx: 0 },
            { label: 'SHIPPED', idx: 1 },
            { label: 'TRANSIT', idx: 2 },
            { label: 'ARRIVAL', idx: 3 }
        ].map(function (s) {
            return stepHtml(s.label, s.idx <= transitIndex);
        }).join('');

        var servicesBlock = serviceBadges.length
            ? (
                '<div class="services-block" style="margin-top:12px;">' +
                '  <div style="font-weight:700; margin-bottom:8px;">White‑Glove Details</div>' +
                '  <div style="display:flex; gap:10px; flex-wrap:wrap;">' +
                serviceBadges.map(function (b) {
                    return (
                        '<div style="background:rgba(20,52,203,0.08); border:1px solid rgba(20,52,203,0.25); padding:10px 12px; border-radius:12px;">' +
                        '  <div style="font-weight:700;">' + escapeHtml(b.title) + '</div>' +
                        '  <div style="opacity:0.85; font-size:13px; margin-top:3px;">' + escapeHtml(b.detail) + '</div>' +
                        '</div>'
                    );
                }).join('') +
                '  </div>' +
                '</div>'
            )
            : '';

        return (
            '<div class="shipment-card">' +
            '  <div class="shipment-img">' +
            '    <img src="' + escapeHtml(img) + '" alt="Shipment item">' +
            '  </div>' +
            '  <div class="shipment-details">' +
            '    <div class="shipment-header">' +
            '      <span class="order-number">' + escapeHtml(orderNumber) + '</span>' +
            '      <span class="badge-transit">' + escapeHtml(status.toUpperCase()) + '</span>' +
            '    </div>' +
            '    <h2 class="product-title">' + escapeHtml(productTitle) + (productMeta ? (' — ' + escapeHtml(productMeta)) : '') + '</h2>' +
            '    ' +
            '    <div class="progress-container">' +
            '      <div class="progress-line"><div class="progress-line-fill"></div></div>' +
            '      <div class="progress-steps">' + steps + '</div>' +
            '    </div>' +
            '    <p class="expected-arrival">' + escapeHtml(expectedArrivalText) + '</p>' +
            '    ' + servicesBlock +
            '    <div class="shipment-actions">' +
            '      <button class="btn-primary" onclick="window.alert(\'Order ID: ' + escapeHtml(order.id || '') + '\\n\\nCustomer: ' + escapeHtml(order.customer ? (order.customer.firstName + ' ' + order.customer.lastName) : '') + '\\n\\nPayment: ' + escapeHtml(order.paymentMethod || '') + '\')">' +
            '        View Progress' +
            '      </button>' +
            '      <button class="btn-secondary" onclick="window.alert(\'Consultation/Delivery stored with your order.\')">Order Details</button>' +
            '    </div>' +
            '  </div>' +
            '</div>'
        );
    }

    function init() {
        var root = document.getElementById('current-shipments');
        if (!root) return;

        var orders = getOrders();
        // Most recent order as current shipment
        var current = orders.slice(0, 3);
        if (!current.length) {
            root.innerHTML = (
                '<div class="shipment-card">' +
                '  <div class="shipment-details">' +
                '    <h2 class="product-title">No current shipments</h2>' +
                '    <p class="expected-arrival">Place an order to see delivery status here.</p>' +
                '  </div>' +
                '</div>'
            );
            return;
        }

        root.innerHTML = current.map(renderOrderCard).join('');
    }

    document.addEventListener('DOMContentLoaded', init);
})();

