## 2024-10-18 - [Nuxt Image Preload Double Download]
**Learning:** Using `preload` on `<NuxtImg>` for both light and dark mode variants (handled via CSS classes like `dark:hidden`) causes the browser to download both images, wasting bandwidth, as the preload scanner doesn't account for CSS visibility.
**Action:** Avoid `preload` on theme-dependent hero images; rely on native lazy-loading or manual preloading of the active theme's image if strictly necessary.

## 2025-05-23 - [Inline SVG Bloat]
**Learning:** Inline SVGs in Vue components, especially those exported directly from design tools without optimization, can be excessively large (e.g., 10KB+ for a single icon). This bloats the initial HTML payload and bundle size.
**Action:** Always inspect inline SVGs in critical components (like Headers/Footers). Replace complex paths with optimized standard icons (e.g., Heroicons) or use an SVG optimization tool.

## 2025-10-27 - [Config File Parsing Bottleneck]
**Learning:** When parsing custom file formats or config files (e.g., `appinfo.spixi` in `server/api/apps.ts`) inside loops or batch operations, prefer using `.indexOf('=')` and `.substring()` instead of `.split('=')` and `.join('=')`. The latter approach creates intermediate arrays for every line, leading to unnecessary O(N) allocations and excessive Garbage Collection (GC) pressure, which becomes a bottleneck when parsing many files.
**Action:** Use string search and slicing (`indexOf` and `substring`) for simple key-value config parsing instead of array splitting and joining to reduce GC overhead in Node.js batch processes.
