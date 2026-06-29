## 2024-10-18 - [Nuxt Image Preload Double Download]
**Learning:** Using `preload` on `<NuxtImg>` for both light and dark mode variants (handled via CSS classes like `dark:hidden`) causes the browser to download both images, wasting bandwidth, as the preload scanner doesn't account for CSS visibility.
**Action:** Avoid `preload` on theme-dependent hero images; rely on native lazy-loading or manual preloading of the active theme's image if strictly necessary.

## 2025-05-23 - [Inline SVG Bloat]
**Learning:** Inline SVGs in Vue components, especially those exported directly from design tools without optimization, can be excessively large (e.g., 10KB+ for a single icon). This bloats the initial HTML payload and bundle size.
**Action:** Always inspect inline SVGs in critical components (like Headers/Footers). Replace complex paths with optimized standard icons (e.g., Heroicons) or use an SVG optimization tool.

## 2025-03-25 - [Vue Computed Search Optimizations]
**Learning:** Reactive computed loops that filter over arrays on every keystroke in Vue (like search) can cause unnecessary CPU overhead and garbage collection pressure due to repeatedly calling `.toLowerCase()` and allocating new strings.
**Action:** Use Nuxt's `useFetch` `transform` option to pre-compute and store these derived strings (e.g., `_searchName`) when the data is initially fetched, so the reactive filter only does simple substring checks.

## 2026-05-02 - [Map Iteration Array Allocation Optimization]
**Learning:** Using `Array.from(map.entries()).find()` for search lookups in a Vue component generates unnecessary O(N) array allocations and puts pressure on garbage collection. Direct iteration via `for...of` over `map.entries()` is significantly faster for lookups.
**Action:** When performing searches or single-pass extractions from Maps, replace `Array.from()` conversions with native `for...of` loops and use `break` for early exits to improve iteration speed and reduce memory overhead.

## 2026-05-02 - [GraphQL Image Payload Optimization]
**Learning:** Querying the `text` field for binary files (like images) on GitHub's GraphQL API causes the entire binary payload to be stringified and downloaded, resulting in massive bandwidth waste and high memory pressure.
**Action:** When using GitHub GraphQL API to verify the existence or properties of a binary file, always query the `byteSize` attribute rather than the `text` attribute to drastically reduce the payload size and improve API response times.
