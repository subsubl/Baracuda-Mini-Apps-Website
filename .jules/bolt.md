## 2024-10-18 - [Nuxt Image Preload Double Download]
**Learning:** Using `preload` on `<NuxtImg>` for both light and dark mode variants (handled via CSS classes like `dark:hidden`) causes the browser to download both images, wasting bandwidth, as the preload scanner doesn't account for CSS visibility.
**Action:** Avoid `preload` on theme-dependent hero images; rely on native lazy-loading or manual preloading of the active theme's image if strictly necessary.

## 2025-05-23 - [Inline SVG Bloat]
**Learning:** Inline SVGs in Vue components, especially those exported directly from design tools without optimization, can be excessively large (e.g., 10KB+ for a single icon). This bloats the initial HTML payload and bundle size.
**Action:** Always inspect inline SVGs in critical components (like Headers/Footers). Replace complex paths with optimized standard icons (e.g., Heroicons) or use an SVG optimization tool.

## 2025-05-24 - [Pre-computing Data for Vue Reactive Loops]
**Learning:** In Nuxt 3/Vue 3 applications handling large data sets, performing expensive operations like string allocations (`.toLowerCase()`) or complex parsing inside reactive computed loops (e.g., list filtering) leads to significant Garbage Collection (GC) pressure and main thread blocking on every keystroke.
**Action:** Utilize the `transform` option in `useFetch` to pre-compute and store normalized data (like search strings) directly on the objects upon initial fetch. This reduces the time complexity inside reactive computed loops from O(N * string_allocations) to pure O(N) comparisons, dramatically improving search responsiveness.
