## 2024-10-18 - [Nuxt Image Preload Double Download]
**Learning:** Using `preload` on `<NuxtImg>` for both light and dark mode variants (handled via CSS classes like `dark:hidden`) causes the browser to download both images, wasting bandwidth, as the preload scanner doesn't account for CSS visibility.
**Action:** Avoid `preload` on theme-dependent hero images; rely on native lazy-loading or manual preloading of the active theme's image if strictly necessary.

## 2025-05-23 - [Inline SVG Bloat]
**Learning:** Inline SVGs in Vue components, especially those exported directly from design tools without optimization, can be excessively large (e.g., 10KB+ for a single icon). This bloats the initial HTML payload and bundle size.
**Action:** Always inspect inline SVGs in critical components (like Headers/Footers). Replace complex paths with optimized standard icons (e.g., Heroicons) or use an SVG optimization tool.

## 2025-03-25 - [Vue Computed Search Optimizations]
**Learning:** Reactive computed loops that filter over arrays on every keystroke in Vue (like search) can cause unnecessary CPU overhead and garbage collection pressure due to repeatedly calling `.toLowerCase()` and allocating new strings.
**Action:** Use Nuxt's `useFetch` `transform` option to pre-compute and store these derived strings (e.g., `_searchName`) when the data is initially fetched, so the reactive filter only does simple substring checks.

## 2025-05-23 - [Nuxt Map Iteration Overhead]
**Learning:** In Nuxt/Vue, using `Array.from(map.entries()).find(...)` or looping over `map.keys()` and then doing separate lookups causes significant O(N) array allocation overhead and redundant iterations. This is especially taxing during drag-and-drop operations (e.g., in a builder component handling file drops).
**Action:** Replace `Array.from().find()` lookups on `Map` structures with standard `for...of` loops over `map.entries()` using early `break` or `return` to prevent unnecessary iterations and allocations. Combine multiple map lookups into a single loop where possible.
