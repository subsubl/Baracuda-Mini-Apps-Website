## 2024-10-18 - [Nuxt Image Preload Double Download]
**Learning:** Using `preload` on `<NuxtImg>` for both light and dark mode variants (handled via CSS classes like `dark:hidden`) causes the browser to download both images, wasting bandwidth, as the preload scanner doesn't account for CSS visibility.
**Action:** Avoid `preload` on theme-dependent hero images; rely on native lazy-loading or manual preloading of the active theme's image if strictly necessary.

## 2025-05-23 - [Inline SVG Bloat]
**Learning:** Inline SVGs in Vue components, especially those exported directly from design tools without optimization, can be excessively large (e.g., 10KB+ for a single icon). This bloats the initial HTML payload and bundle size.
**Action:** Always inspect inline SVGs in critical components (like Headers/Footers). Replace complex paths with optimized standard icons (e.g., Heroicons) or use an SVG optimization tool.

## 2025-03-14 - [Pre-computing searchable text strings]
**Learning:** In Vue apps handling large lists of objects to be filtered via computed properties, calling string manipulation methods like `.toLowerCase()` inside the `filter` loop causes unnecessary repeated string allocations and garbage collection overhead, particularly if the string is unchanged across filtering passes.
**Action:** Use Nuxt's `useFetch` transform option (or similar data-fetching hooks) to pre-compute and store searchable lowercased strings once when data is fetched, instead of computing them inside reactive filter loops.
