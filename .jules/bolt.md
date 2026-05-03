## 2024-10-18 - [Nuxt Image Preload Double Download]
**Learning:** Using `preload` on `<NuxtImg>` for both light and dark mode variants (handled via CSS classes like `dark:hidden`) causes the browser to download both images, wasting bandwidth, as the preload scanner doesn't account for CSS visibility.
**Action:** Avoid `preload` on theme-dependent hero images; rely on native lazy-loading or manual preloading of the active theme's image if strictly necessary.

## 2025-05-23 - [Inline SVG Bloat]
**Learning:** Inline SVGs in Vue components, especially those exported directly from design tools without optimization, can be excessively large (e.g., 10KB+ for a single icon). This bloats the initial HTML payload and bundle size.
**Action:** Always inspect inline SVGs in critical components (like Headers/Footers). Replace complex paths with optimized standard icons (e.g., Heroicons) or use an SVG optimization tool.

## 2025-03-25 - [Vue Computed Search Optimizations]
**Learning:** Reactive computed loops that filter over arrays on every keystroke in Vue (like search) can cause unnecessary CPU overhead and garbage collection pressure due to repeatedly calling `.toLowerCase()` and allocating new strings.
**Action:** Use Nuxt's `useFetch` `transform` option to pre-compute and store these derived strings (e.g., `_searchName`) when the data is initially fetched, so the reactive filter only does simple substring checks.

## 2025-05-24 - [Avoid Array.from(map.entries()) for lookups]
**Learning:** Using `Array.from(map.entries()).find()` for lookups within Nuxt/Vue applications causes unnecessary O(N) array memory allocations. Direct iteration over `Map.entries()` using a `for...of` loop is about ~3x faster and significantly reduces garbage collection pressure, particularly noticeable when handling a large number of map entries or executing lookups inside frequently triggered validations.
**Action:** Always prefer `for...of` loops over `Map.entries()` (or `Map.keys()`, `Map.values()`) instead of converting the iterators to an array for searches and validations.
