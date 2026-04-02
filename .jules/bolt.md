## 2024-10-18 - [Nuxt Image Preload Double Download]
**Learning:** Using `preload` on `<NuxtImg>` for both light and dark mode variants (handled via CSS classes like `dark:hidden`) causes the browser to download both images, wasting bandwidth, as the preload scanner doesn't account for CSS visibility.
**Action:** Avoid `preload` on theme-dependent hero images; rely on native lazy-loading or manual preloading of the active theme's image if strictly necessary.

## 2025-05-23 - [Inline SVG Bloat]
**Learning:** Inline SVGs in Vue components, especially those exported directly from design tools without optimization, can be excessively large (e.g., 10KB+ for a single icon). This bloats the initial HTML payload and bundle size.
**Action:** Always inspect inline SVGs in critical components (like Headers/Footers). Replace complex paths with optimized standard icons (e.g., Heroicons) or use an SVG optimization tool.

## 2025-03-25 - [Vue Computed Search Optimizations]
**Learning:** Reactive computed loops that filter over arrays on every keystroke in Vue (like search) can cause unnecessary CPU overhead and garbage collection pressure due to repeatedly calling `.toLowerCase()` and allocating new strings.
**Action:** Use Nuxt's `useFetch` `transform` option to pre-compute and store these derived strings (e.g., `_searchName`) when the data is initially fetched, so the reactive filter only does simple substring checks.
## 2024-05-15 - [Direct String Parsing over Regex/Split]
**Learning:** In Nuxt/Node environments, creating intermediate arrays via `split('=')` or relying on regex for simple key-value config parsing (like `appinfo.spixi`) incurs high memory allocation and garbage collection overhead. Using `.indexOf('=')` and `.substring()` is consistently ~2.5x faster.
**Action:** When parsing simple line-based `.ini` or `.spixi` configuration files in this repository, always prefer direct string indexing (`indexOf`/`substring`) to avoid unnecessary array allocations.

## 2024-05-15 - [Direct Map Iteration vs Array Conversion]
**Learning:** Converting a `Map` to an array using `Array.from(map.entries()).find(...)` just to find a single entry creates an unnecessary `O(N)` array in memory. A direct `for...of` loop over `map.entries()` avoids this allocation entirely and is significantly faster in the Nuxt environment.
**Action:** For simple searches within a `Map`, especially within reactive contexts or file processing loops (like in the packer/builder), use a `for...of` loop rather than array conversion methods.
