## 2024-10-18 - [Nuxt Image Preload Double Download]
**Learning:** Using `preload` on `<NuxtImg>` for both light and dark mode variants (handled via CSS classes like `dark:hidden`) causes the browser to download both images, wasting bandwidth, as the preload scanner doesn't account for CSS visibility.
**Action:** Avoid `preload` on theme-dependent hero images; rely on native lazy-loading or manual preloading of the active theme's image if strictly necessary.

## 2025-05-23 - [Inline SVG Bloat]
**Learning:** Inline SVGs in Vue components, especially those exported directly from design tools without optimization, can be excessively large (e.g., 10KB+ for a single icon). This bloats the initial HTML payload and bundle size.
**Action:** Always inspect inline SVGs in critical components (like Headers/Footers). Replace complex paths with optimized standard icons (e.g., Heroicons) or use an SVG optimization tool.

## 2025-03-25 - [Vue Computed Search Optimizations]
**Learning:** Reactive computed loops that filter over arrays on every keystroke in Vue (like search) can cause unnecessary CPU overhead and garbage collection pressure due to repeatedly calling `.toLowerCase()` and allocating new strings.
**Action:** Use Nuxt's `useFetch` `transform` option to pre-compute and store these derived strings (e.g., `_searchName`) when the data is initially fetched, so the reactive filter only does simple substring checks.

## 2024-05-22 - Optimize Map Iteration
**Learning:** In the Vue composition API, using `Array.from(map.entries()).find(...)` for map lookups allocates an unnecessary O(N) array in memory, causing overhead and GC pressure. Combining such iterations into a single `for...of` loop over `map.entries()` allows early exits and performs multiple checks simultaneously without intermediate allocations. Direct map iteration is consistently 3-4x faster than intermediate array conversion in Nuxt environments.
**Action:** When inspecting iterations, always check if multiple case-insensitive lookups or validations can be aggregated into a single `for...of` map iteration. Avoid intermediate `Array.from()` calls when simply searching for an item.
