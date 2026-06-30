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

## 2024-07-28 - [GraphQL Recursive Tree vs Batch Alias Optimization]
**Learning:** Using a deep recursive tree query in GraphQL to fetch the existence of specific files (like binary images) across many directories results in downloading massive, unnecessary payloads, especially if querying the `text` field on `Blob` objects.
**Action:** When file existence checks are needed across multiple directories in GraphQL, use a two-step approach: first list directories, then construct a chunked batch query (e.g., 50 items per batch) using index-based aliases (e.g., `app0_info`). For binary files, query `byteSize` instead of `text` to verify existence without downloading the payload.
