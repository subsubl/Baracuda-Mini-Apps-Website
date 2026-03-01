## 2024-10-18 - [Nuxt Image Preload Double Download]
**Learning:** Using `preload` on `<NuxtImg>` for both light and dark mode variants (handled via CSS classes like `dark:hidden`) causes the browser to download both images, wasting bandwidth, as the preload scanner doesn't account for CSS visibility.
**Action:** Avoid `preload` on theme-dependent hero images; rely on native lazy-loading or manual preloading of the active theme's image if strictly necessary.

## 2025-05-23 - [Inline SVG Bloat]
**Learning:** Inline SVGs in Vue components, especially those exported directly from design tools without optimization, can be excessively large (e.g., 10KB+ for a single icon). This bloats the initial HTML payload and bundle size.
**Action:** Always inspect inline SVGs in critical components (like Headers/Footers). Replace complex paths with optimized standard icons (e.g., Heroicons) or use an SVG optimization tool.

## 2025-06-05 - [Hydration Delay in Theme Switcher]
**Learning:** Using `<client-only>` and `v-if` with `$colorMode.value` for toggling theme icons in Vue 3 (Nuxt 3) delays rendering of the theme switcher icon until client hydration. This negatively impacts the initial visual complete metric and causes layout shift.
**Action:** Replace `<client-only>` and `v-if` checks on `$colorMode` with CSS visibility toggles (e.g., `hidden dark:block`) to enable seamless SSR rendering of theme-dependent visual elements.
