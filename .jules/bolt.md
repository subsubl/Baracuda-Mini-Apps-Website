## 2024-10-18 - [Nuxt Image Preload Double Download]
**Learning:** Using `preload` on `<NuxtImg>` for both light and dark mode variants (handled via CSS classes like `dark:hidden`) causes the browser to download both images, wasting bandwidth, as the preload scanner doesn't account for CSS visibility.
**Action:** Avoid `preload` on theme-dependent hero images; rely on native lazy-loading or manual preloading of the active theme's image if strictly necessary.

## 2025-05-23 - [Inline SVG Bloat]
**Learning:** Inline SVGs in Vue components, especially those exported directly from design tools without optimization, can be excessively large (e.g., 10KB+ for a single icon). This bloats the initial HTML payload and bundle size.
**Action:** Always inspect inline SVGs in critical components (like Headers/Footers). Replace complex paths with optimized standard icons (e.g., Heroicons) or use an SVG optimization tool.

## 2025-03-25 - [Vue Computed Search Optimizations]
**Learning:** Reactive computed loops that filter over arrays on every keystroke in Vue (like search) can cause unnecessary CPU overhead and garbage collection pressure due to repeatedly calling `.toLowerCase()` and allocating new strings.
**Action:** Use Nuxt's `useFetch` `transform` option to pre-compute and store these derived strings (e.g., `_searchName`) when the data is initially fetched, so the reactive filter only does simple substring checks.

## 2025-06-12 - [appinfo.spixi String Parsing Optimization]
**Learning:** Parsing the `appinfo.spixi` metadata file line-by-line using `line.split('=')` or regex matching (`/^\s*([^=]+?)\s*=\s*(.*?)\s*$/`) creates unnecessary object and array allocations in a hot path, causing extra garbage collection pressure.
**Action:** Use `.indexOf('=')` and `.substring()` instead of regex or `.split('=')` when parsing key-value pair files like `appinfo.spixi`. Benchmark results show this approach is ~2.5x faster.

## 2025-06-12 - [Map iteration optimization]
**Learning:** Using `Array.from(map.entries()).find(...)` for case-insensitive lookup within a `Map` creates an unnecessary intermediate O(N) array allocation, putting unnecessary pressure on the garbage collector, especially in Nuxt component rendering cycles.
**Action:** When performing case-insensitive lookups on a `Map`, use a `for...of` loop over `.entries()` instead of `Array.from()` to avoid O(N) array allocations. Direct iteration is approximately 3x faster in the Nuxt environment.
