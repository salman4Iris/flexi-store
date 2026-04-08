# Plan: Fix Luxury Theme Color Application Throughout flexi-store

**TL;DR:** The ThemeProvider correctly applies CSS variables (like `--color-bg: #020617` for luxury), but components throughout the app use hardcoded colors (`bg-white`, `dark:bg-gray-900`, hover states with `bg-gray-100`) that override the theme variables. The toggle function also only switches between two themes instead of cycling through all three. We need to: (1) Replace hardcoded Tailwind color classes with CSS variable syntax, (2) Fix the toggle to support all three themes, and (3) Update hover/interactive states to use theme variables while maintaining visual hierarchy.

## Steps

1. **Enhance ThemeProvider toggle function** in `src/providers/ThemeProvider.tsx`
   - Change toggle to cycle through all three themes: `default` → `luxury` → `minimal` → `default`
   - This allows users to test all themes, not just two
   - Update the condition to use `themeNames` array with `indexOf` logic

2. **Fix Navbar component** in `src/components/layouts/Navbar.tsx`
   - Replace hardcoded `bg-white dark:bg-gray-900` with `bg-(--color-bg)`
   - Replace `hover:bg-gray-100 hover:text-black dark:hover:bg-gray-700 dark:hover:text-white` with theme-aware pattern: `hover:bg-(--color-bg)/80` (reduces opacity instead of changing color)
   - Change `border-gray-200 dark:border-gray-800` to use `border-(--color-primary)` or secondary color
   - All text should use `text-(--color-text)`
   - ~40+ instances need updating

3. **Fix SearchBar component** in `src/components/layouts/SearchBar.tsx`
   - Replace `bg-white dark:bg-gray-900` dropdown backgrounds with `bg-(--color-bg)`
   - Update hover states similarly: `hover:bg-(--color-bg)/80`
   - Border colors to use theme variables

4. **Update HeroSection** in `src/features/home/components/HeroSection.tsx`
   - Replace hardcoded `from-blue-50 to-indigo-50` gradient with `bg-(--color-bg)`
   - Replace `from-blue-600 to-indigo-600` button/text backgrounds with `bg-(--color-primary)`
   - Update text to use `text-(--color-text)` where applicable

5. **Fix HeroSlider component** in `src/features/home/components/HeroSlider.tsx`
   - Update overlay: `bg-white/30` → `bg-(--color-bg)/30` or `bg-(--color-primary)/30`
   - Button colors use theme variables
   - Navigation arrows styled with theme colors

6. **Update NewsletterSection** in `src/features/home/components/NewsletterSection.tsx`
   - Replace `from-blue-600 to-indigo-600` gradient background with solid `bg-(--color-primary)`
   - Update button and text colors to use theme variables
   - Success/error message colors handled appropriately

7. **Fix ProductDetails component** in `src/features/products/components/ProductDetails.tsx`
   - Replace hardcoded blue content boxes (`bg-blue-50 border-blue-200 text-blue-900`) with theme-aware variant:
     - Background: `bg-(--color-bg)`
     - Border: `border-1 border-(--color-primary)/30`
     - Text: `text-(--color-text)`
   - Update the "Free Shipping", "30-day Returns" sections

8. **Update ProductCard component** in `src/features/products/components/ProductCard.tsx`
   - Card background: `bg-(--color-bg)`
   - Text: `text-(--color-text)`
   - Discount badge: use `bg-(--color-primary)` with `text-white` or theme-contrasting color

9. **Fix ImageCarousel** in `src/features/products/components/ImageCarousel.tsx`
   - Discount badge `bg-red-500` → `bg-(--color-primary)` (or add secondary color to theme)
   - Controls styled with theme colors

10. **Update Checkout pages** in `src/app/checkout/page.tsx` and `src/app/checkout/success/page.tsx`
    - Replace status indicator colors (`text-green-600`, `bg-green-50`, `border-green-200`)
    - Consider: either use theme primary color with opacity, or add secondary colors to ThemeProvider (success: green, error: red)
    - Update text colors to use theme variables

11. **Fix Order page** in `src/app/order/page.tsx`
    - Status badge colors use theme-aware pattern
    - Text and backgrounds use CSS variables

12. **Optional: Add secondary colors to ThemeProvider** in `src/providers/ThemeProvider.tsx`
    - Consider adding `--color-success`, `--color-error`, `--color-warning` to the luxury theme definition
    - This allows status messages to have appropriate feedback while respecting the luxury aesthetic
    - Example: luxury could use `--color-success: "#22c55e"` (emerald green) or a muted variant

13. **Verify globals.css utilities** in `src/app/globals.css`
    - Ensure all custom utility classes like `.bg-background`, `.text-primary` are defined and working
    - Add any missing utilities needed (e.g., `.border-primary`, `.bg-primary/80` for opacity variations)

14. **Testing**
    - Switch to luxury theme via the toggle button (once enhanced to cycle all 3 themes)
    - Verify all pages display correctly: home, products, product details, checkout, orders, account
    - Check that navigation, dropdowns, hover states all respect theme colors
    - Verify text contrast meets accessibility standards
    - Test on both desktop and mobile
    - Run `npm run lint` to check for any issues

## Verification

```bash
# Switch themes via UI and verify visually across all pages
# Check these pages specifically in luxury theme:
- Home page (hero, newsletter, categories)
- Products listing page
- Product detail page
- Cart page
- Checkout page
- Order page
- Navigation (desktop and mobile)

# Run linting to catch any issues
npm run lint
```

## Decisions

- Theme toggle will cycle through all three themes instead of just two for better UX
- Hardcoded colors will be replaced with CSS variable syntax throughout
- Hover/interactive states will use opacity-based variations (`bg-(--color-bg)/80`) rather than completely different colors to maintain theme consistency
- For status colors (success/error), we can either: (a) use muted theme primary color, (b) add new CSS variables to the theme, or (c) keep limited hardcoded status colors. **Recommend option (b)** for professional appearance.

## Key Issues Found

| Component | Issue | Priority |
|-----------|-------|----------|
| Navbar | 40+ hardcoded color classes | CRITICAL |
| ProductDetails | Blue content sections unreadable on dark theme | CRITICAL |
| HeroSection | Hardcoded blue gradients ignore theme | HIGH |
| SearchBar | Dropdown colors hardcoded | HIGH |
| NewsletterSection | Gradient colors hardcoded | HIGH |
| HeroSlider | Background overlays hardcoded | MEDIUM |
| ProductCard | Card styling hardcoded | MEDIUM |
| Checkout/Orders | Status colors hardcoded | MEDIUM |
| ImageCarousel | Badge color hardcoded | LOW |
| ThemeProvider | Toggle only cycles 2 themes instead of 3 | LOW |

## Technical Context

- **CSS Variables Applied**: `--color-primary`, `--color-bg`, `--color-text`, `--radius`
- **Current Theme Values**:
  - Default: Primary `#111111`, BG `#ffffff`, Text `#222222`
  - Luxury: Primary `#0f172a`, BG `#020617`, Text `#e5e7eb`
  - Minimal: Primary `#0b1220`, BG `#f7f7f8`, Text `#0f172a`
- **CSS Variable Syntax**: `bg-(--color-bg)`, `text-(--color-text)`, `border-(--color-primary)`
- **Hover Pattern**: Use opacity reduction instead of color change: `hover:bg-(--color-bg)/80`
