## 2024-10-18 - [Nuxt Image Preload Double Download]
**Learning:** Using `preload` on `<NuxtImg>` for both light and dark mode variants (handled via CSS classes like `dark:hidden`) causes the browser to download both images, wasting bandwidth, as the preload scanner doesn't account for CSS visibility.
**Action:** Avoid `preload` on theme-dependent hero images; rely on native lazy-loading or manual preloading of the active theme's image if strictly necessary.

## 2025-05-23 - [Inline SVG Bloat]
**Learning:** Inline SVGs in Vue components, especially those exported directly from design tools without optimization, can be excessively large (e.g., 10KB+ for a single icon). This bloats the initial HTML payload and bundle size.
**Action:** Always inspect inline SVGs in critical components (like Headers/Footers). Replace complex paths with optimized standard icons (e.g., Heroicons) or use an SVG optimization tool.

## 2025-03-25 - [Vue Computed Search Optimizations]
**Learning:** Reactive computed loops that filter over arrays on every keystroke in Vue (like search) can cause unnecessary CPU overhead and garbage collection pressure due to repeatedly calling `.toLowerCase()` and allocating new strings.
**Action:** Use Nuxt's `useFetch` `transform` option to pre-compute and store these derived strings (e.g., `_searchName`) when the data is initially fetched, so the reactive filter only does simple substring checks.
## 2024-05-30 - Map Lookup Optimization in Nuxt
**Learning:** In the Nuxt environment (and Node.js generally), using `Array.from(map.entries()).find()` for case-insensitive map lookups is noticeably slower (~8.5x slower in synthetic benchmarks on V8) than a `for...of` loop over `map.entries()`. The array approach allocates an entirely new array of the map's elements, increasing garbage collection pressure, and performs an O(N) copy before iterating.
**Action:** Always prefer a `for...of` loop for case-insensitive `Map` key lookups to avoid unnecessary memory allocations and to enable early exit when the key is found.
