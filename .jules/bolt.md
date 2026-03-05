## 2024-10-18 - [Nuxt Image Preload Double Download]
**Learning:** Using `preload` on `<NuxtImg>` for both light and dark mode variants (handled via CSS classes like `dark:hidden`) causes the browser to download both images, wasting bandwidth, as the preload scanner doesn't account for CSS visibility.
**Action:** Avoid `preload` on theme-dependent hero images; rely on native lazy-loading or manual preloading of the active theme's image if strictly necessary.

## 2025-05-23 - [Inline SVG Bloat]
**Learning:** Inline SVGs in Vue components, especially those exported directly from design tools without optimization, can be excessively large (e.g., 10KB+ for a single icon). This bloats the initial HTML payload and bundle size.
**Action:** Always inspect inline SVGs in critical components (like Headers/Footers). Replace complex paths with optimized standard icons (e.g., Heroicons) or use an SVG optimization tool.

## 2025-05-23 - [Nuxt useFetch transform for Frontend Array Filtering]
**Learning:** Filtering large arrays of objects in a Vue `computed` property on the frontend can be slow and cause excessive memory allocation (O(N) string allocations) if string manipulations like `.toLowerCase()` are done during every filter iteration.
**Action:** Use Nuxt 3's `useFetch` composable's `transform` option to pre-compute necessary values (like lowercased strings for search queries) when the data is initially fetched. This moves the cost from O(N) per keystroke to a one-time O(N) cost at fetch time, significantly improving rendering performance during user searches.
