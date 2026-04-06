## 2024-10-18 - [Nuxt Image Preload Double Download]
**Learning:** Using `preload` on `<NuxtImg>` for both light and dark mode variants (handled via CSS classes like `dark:hidden`) causes the browser to download both images, wasting bandwidth, as the preload scanner doesn't account for CSS visibility.
**Action:** Avoid `preload` on theme-dependent hero images; rely on native lazy-loading or manual preloading of the active theme's image if strictly necessary.

## 2025-05-23 - [Inline SVG Bloat]
**Learning:** Inline SVGs in Vue components, especially those exported directly from design tools without optimization, can be excessively large (e.g., 10KB+ for a single icon). This bloats the initial HTML payload and bundle size.
**Action:** Always inspect inline SVGs in critical components (like Headers/Footers). Replace complex paths with optimized standard icons (e.g., Heroicons) or use an SVG optimization tool.

## 2025-03-25 - [Vue Computed Search Optimizations]
**Learning:** Reactive computed loops that filter over arrays on every keystroke in Vue (like search) can cause unnecessary CPU overhead and garbage collection pressure due to repeatedly calling `.toLowerCase()` and allocating new strings.
**Action:** Use Nuxt's `useFetch` `transform` option to pre-compute and store these derived strings (e.g., `_searchName`) when the data is initially fetched, so the reactive filter only does simple substring checks.
## 2024-05-18 - String Parsing Optimization (appinfo.spixi)
**Learning:** For parsing simple key=value text formats like `appinfo.spixi` in Nuxt/Node environments, splitting strings via `.split(/\r?\n/)` or `.split('=')` coupled with regex matching creates excessive, short-lived O(N) array allocations that trigger heavy garbage collection. Using a `while` loop with `.indexOf()` and `.substring()` avoids array creation entirely and proved to be ~2x faster in benchmarks.
**Action:** When parsing simple line-by-line configuration files, prefer a memory-efficient `while` loop scanning with `.indexOf('\n')` and `.indexOf('=')` instead of regex matching and `.split()` arrays, especially when executed repeatedly (e.g., in batch processing or during the API generation fallback loop).
