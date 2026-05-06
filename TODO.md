# TODO - Halcyon E-COMMERCE

- [x] Fix all broken product image paths in `js/database.js` so every product loads an existing image.
- [ ] Ensure product detail page (`productdetail.html` + `js/productdetail.js` if any) renders the correct product image(s) using `product.img`.
- [x] Scan all HTML files for `onclick="..."` handlers that call missing functions; patch them to call the correct global functions (from `js/global.js`, `js/search.js`, etc.).
- [ ] Scan all HTML/JS for remaining `images/additional/` references and either (a) keep the subfolder if it exists, or (b) normalize paths to `images/<filename>` based on real filesystem.
- [ ] Run a quick smoke test by launching `index.html` and verifying: product grid renders, clicking product works, add to cart works, cart badge updates, checkout order summary images render.

## Checkout correctness
- [ ] Fix `js/checkout.js` checkout summary so it uses the real cart item details (img/name/meta) via `getProductById(item.id)`; remove the current hardcoded item-id demo mapping.
