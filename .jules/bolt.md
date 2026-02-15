## 2024-10-18 - [Nuxt Image Preload Double Download]
**Learning:** Using `preload` on `<NuxtImg>` for both light and dark mode variants (handled via CSS classes like `dark:hidden`) causes the browser to download both images, wasting bandwidth, as the preload scanner doesn't account for CSS visibility.
**Action:** Avoid `preload` on theme-dependent hero images; rely on native lazy-loading or manual preloading of the active theme's image if strictly necessary.

## 2025-05-23 - [Inline SVG Bloat]
**Learning:** Inline SVGs in Vue components, especially those exported directly from design tools without optimization, can be excessively large (e.g., 10KB+ for a single icon). This bloats the initial HTML payload and bundle size.
**Action:** Always inspect inline SVGs in critical components (like Headers/Footers). Replace complex paths with optimized standard icons (e.g., Heroicons) or use an SVG optimization tool.

## 2025-05-23 - [Optimize GitHub GraphQL Fetching]
**Learning:** Fetching the entire file tree content via GraphQL (`... on Blob { text }`) is extremely inefficient for bandwidth and processing, especially if binary files (like images) are included. The API returns the content of *every* file, which is wasteful.
**Action:** Use a two-step approach: 1) Fetch directory structure (names only). 2) Construct a single batched query with aliases to fetch *only* the specific text files needed (e.g., `appinfo.spixi`) and check for existence of others.
