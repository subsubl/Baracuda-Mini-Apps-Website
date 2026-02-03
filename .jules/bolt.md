## 2024-10-18 - [Nuxt Image Preload Double Download]
**Learning:** Using `preload` on `<NuxtImg>` for both light and dark mode variants (handled via CSS classes like `dark:hidden`) causes the browser to download both images, wasting bandwidth, as the preload scanner doesn't account for CSS visibility.
**Action:** Avoid `preload` on theme-dependent hero images; rely on native lazy-loading or manual preloading of the active theme's image if strictly necessary.

## 2026-02-03 - [Unsafe Event Access in Image Error Handlers]
**Learning:** Accessing `$event.target.style` directly in `@error` handlers (e.g., `@error="$event.target.style.display='none'"`) can cause client-side hydration crashes with "Cannot read properties of null (reading 'style')" if the event target is not correctly bound or if the event fires in an unexpected context (e.g. during specific SSR/hydration mismatches or network failures in test environments).
**Action:** Always safely check for existence: `@error="$event.target ? $event.target.style.display='none' : null"`.

## 2026-02-03 - [Removing Heavy UI Libraries for Simple Components]
**Learning:** `flowbite` was used solely for a single dropdown menu but incurred a heavy initialization cost (`initFlowbite` scanning the DOM on every mount) and added 15KB+ to the bundle.
**Action:** Replace single-use UI library components with lightweight Vue/Tailwind implementations (using `v-show`, `ref`, and click-outside listeners) to significantly reduce bundle size and runtime overhead.
