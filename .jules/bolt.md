## 2024-10-18 - [Nuxt Image Preload Double Download]
**Learning:** Using `preload` on `<NuxtImg>` for both light and dark mode variants (handled via CSS classes like `dark:hidden`) causes the browser to download both images, wasting bandwidth, as the preload scanner doesn't account for CSS visibility.
**Action:** Avoid `preload` on theme-dependent hero images; rely on native lazy-loading or manual preloading of the active theme's image if strictly necessary.

## 2025-05-23 - [Inline SVG Bloat]
**Learning:** Inline SVGs in Vue components, especially those exported directly from design tools without optimization, can be excessively large (e.g., 10KB+ for a single icon). This bloats the initial HTML payload and bundle size.
**Action:** Always inspect inline SVGs in critical components (like Headers/Footers). Replace complex paths with optimized standard icons (e.g., Heroicons) or use an SVG optimization tool.

## 2025-03-25 - [Vue Computed Search Optimizations]
**Learning:** Reactive computed loops that filter over arrays on every keystroke in Vue (like search) can cause unnecessary CPU overhead and garbage collection pressure due to repeatedly calling `.toLowerCase()` and allocating new strings.
**Action:** Use Nuxt's `useFetch` `transform` option to pre-compute and store these derived strings (e.g., `_searchName`) when the data is initially fetched, so the reactive filter only does simple substring checks.

## 2025-06-17 - [Nuxt Client-Only Hydration Optimization]
**Learning:** Using `<client-only>` to wrap SVGs with reactive `v-if="$colorMode.value"` based on the theme causes a flash of unstyled content and hydration layout shifts during Server-Side Rendering (SSR). Removing the wrapper and relying solely on `v-if` causes a major hydration mismatch bug if the user's local preference differs from the server.
**Action:** Remove `<client-only>` and `v-if`. Instead, consolidate identical light/dark SVG paths into a single path using `fill="currentColor"`, and apply Tailwind CSS text color classes (e.g., `text-spixi dark:text-white`). For entirely different SVGs, render both and use CSS visibility classes (`hidden dark:block`, `block dark:hidden`) to handle theming. This ensures the correct element is immediately visible without client-side hydration delays.
