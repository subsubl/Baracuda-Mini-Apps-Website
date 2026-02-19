## 2024-10-18 - [Nuxt Image Preload Double Download]
**Learning:** Using `preload` on `<NuxtImg>` for both light and dark mode variants (handled via CSS classes like `dark:hidden`) causes the browser to download both images, wasting bandwidth, as the preload scanner doesn't account for CSS visibility.
**Action:** Avoid `preload` on theme-dependent hero images; rely on native lazy-loading or manual preloading of the active theme's image if strictly necessary.

## 2025-05-23 - [Inline SVG Bloat]
**Learning:** Inline SVGs in Vue components, especially those exported directly from design tools without optimization, can be excessively large (e.g., 10KB+ for a single icon). This bloats the initial HTML payload and bundle size.
**Action:** Always inspect inline SVGs in critical components (like Headers/Footers). Replace complex paths with optimized standard icons (e.g., Heroicons) or use an SVG optimization tool.

## 2025-05-23 - [GitHub GraphQL Deep Fetching]
**Learning:** Fetching a recursive tree with file content using GitHub GraphQL API (`... on Tree { entries { ... on Blob { text } } }`) scales poorly. It downloads the entire repository content if not careful, leading to massive payloads and potential timeouts.
**Action:** Use a two-step approach: 1. List directories (shallow). 2. Construct a batch query with aliases to fetch *only* specific files (`appinfo.spixi`, `icon.png`) for each directory. This reduces payload size by orders of magnitude.
