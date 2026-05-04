# E-Commerce Additional Images Integration TODO

## Plan Overview
Integrate all ~200 images from `images/additional/` into product catalog:
- Categorize: chairs→office-chairs/sofas, beds→bedroom, decorations→decor, lightings→lighting, sofas→sofas, tables→tables/kitchen/office
- Add to `js/database.js` products array (IDs 41+)
- Replace Unsplash URLs everywhere
- Ensure searchable/filterable

## Steps (to be checked off)

### 1. [x] Create TODO.md
### 2. [ ] Update js/database.js: Replace Unsplash → local, add ALL additional images as products
### 3. [ ] Update js/new_products.js: Merge into database.js or remove
### 4. [ ] Fix HTML hardcoded images: productdetail.html, details.html, checkout.html, trackorder.html, search.html
### 5. [ ] Test categories: productlist.html?category=sofas|office-chairs|bedroom|kitchen
### 6. [ ] Test search: search.html for new product names
### 7. [ ] Verify no broken images, update TODO.md, attempt_completion

**Next: js/database.js update**

