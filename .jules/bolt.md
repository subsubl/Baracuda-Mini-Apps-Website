## 2024-10-18 - [Nuxt Image Preload Double Download]
**Learning:** Using `preload` on `<NuxtImg>` for both light and dark mode variants (handled via CSS classes like `dark:hidden`) causes the browser to download both images, wasting bandwidth, as the preload scanner doesn't account for CSS visibility.
**Action:** Avoid `preload` on theme-dependent hero images; rely on native lazy-loading or manual preloading of the active theme's image if strictly necessary.

## 2025-05-23 - [Inline SVG Bloat]
**Learning:** Inline SVGs in Vue components, especially those exported directly from design tools without optimization, can be excessively large (e.g., 10KB+ for a single icon). This bloats the initial HTML payload and bundle size.
**Action:** Always inspect inline SVGs in critical components (like Headers/Footers). Replace complex paths with optimized standard icons (e.g., Heroicons) or use an SVG optimization tool.

## 2025-03-25 - [Vue Computed Search Optimizations]
**Learning:** Reactive computed loops that filter over arrays on every keystroke in Vue (like search) can cause unnecessary CPU overhead and garbage collection pressure due to repeatedly calling `.toLowerCase()` and allocating new strings.
**Action:** Use Nuxt's `useFetch` `transform` option to pre-compute and store these derived strings (e.g., `_searchName`) when the data is initially fetched, so the reactive filter only does simple substring checks.
## 2026-06-01 - [Optimize JS Map iteration in builder.vue]
**Learning:** In the Spixi builder utility, performing multiple `Array.from(map.entries())` calls for lookup during file validation introduces O(N) array allocations and garbage collection overhead. Since Nuxt operates in a browser context for the builder, reducing allocations keeps the memory footprint lower. Combining these lookups into a single `for...of` loop prevents this overhead.
**Action:** When validating or extracting specific items from a large Map or Set in Vue components, use direct `for...of` iteration instead of array conversions (`Array.from()`) combined with array methods like `.find()`, to avoid O(N) intermediate array generation and allow for early loop exits.
