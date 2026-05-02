# Cart Notification Enhancement Plan

## Task: Fix cart notification - add visual effect when item is added to cart across all sections

## Current Analysis:
The cart notification (`showCartNotification`) exists in:
1. **js/global.js** - `addItemToCart()` function calls `showCartNotification(product.name)`
2. **js/search.js** - `addToCartFromSearch()` calls `showCartNotification(product.name)`
3. **productdetail.html** - Uses `addItemToCartFromDetail()` which calls `addItemToCart()` (shows notification)
4. **index.html** - Uses `addItemToCart(4)`, `addItemToCart(11)`, etc. (shows notification)
5. **productlist.html** - Uses `addItemToCart(p.id)` (shows notification)

## Issues Found:
1. The notification simply appears - no "flying" or "cart bounce" animation effect to the cart icon
2. The cart badge doesn't animate on addition
3. Missing visual feedback linking the button to the cart icon

## Plan:

### Step 1: Enhance css/cart-notification.css
- Add `@keyframes` for flying effect animation
- Add cart badge pulse/bounce animation
- Add notification slide-to-cart animation

### Step 2: Modify js/global.js
- Update `addItemToCart()` to:
  - Create flying element from button position
  - Animate element to cart icon location
  - Trigger badge bounce animation
  - Show notification toast

### Step 3: No changes needed in other files
- All sections already call `addItemToCart()` which handles notification

## Implementation:
Focus on enhancing the visual experience with:
1. Flying "cart" icon animation from button to cart icon
2. Cart badge bounce/pulse effect
3. Smooth notification toast appear

This will create the "effect going to the cart" that user requested.

## Files to Edit:
1. css/cart-notification.css - Add animation keyframes
2. js/global.js - Update addItemToCart() function for flying effect
