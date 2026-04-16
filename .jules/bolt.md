## 2024-10-18 - [Nuxt Image Preload Double Download]
**Learning:** Using `preload` on `<NuxtImg>` for both light and dark mode variants (handled via CSS classes like `dark:hidden`) causes the browser to download both images, wasting bandwidth, as the preload scanner doesn't account for CSS visibility.
**Action:** Avoid `preload` on theme-dependent hero images; rely on native lazy-loading or manual preloading of the active theme's image if strictly necessary.

## 2025-05-23 - [Inline SVG Bloat]
**Learning:** Inline SVGs in Vue components, especially those exported directly from design tools without optimization, can be excessively large (e.g., 10KB+ for a single icon). This bloats the initial HTML payload and bundle size.
**Action:** Always inspect inline SVGs in critical components (like Headers/Footers). Replace complex paths with optimized standard icons (e.g., Heroicons) or use an SVG optimization tool.

## 2025-03-25 - [Vue Computed Search Optimizations]
**Learning:** Reactive computed loops that filter over arrays on every keystroke in Vue (like search) can cause unnecessary CPU overhead and garbage collection pressure due to repeatedly calling `.toLowerCase()` and allocating new strings.
**Action:** Use Nuxt's `useFetch` `transform` option to pre-compute and store these derived strings (e.g., `_searchName`) when the data is initially fetched, so the reactive filter only does simple substring checks.

## 2024-04-16 - [SSR Theme Hydration Optimization]
**Learning:** Using `<client-only>` and `v-if="$colorMode.value === 'dark'"` for theme-dependent icons in Nuxt causes the icon to be completely missing during the initial server render. It only appears after the client-side JavaScript has downloaded and hydrated, causing Layout Shifts (CLS) and a poor user experience.
**Action:** Always prefer rendering both SVGs in the DOM and using CSS display classes (like Tailwind's `hidden dark:block` and `block dark:hidden`) to toggle visibility based on the `<html>` or `<body>` class applied by the theme script before hydration.
