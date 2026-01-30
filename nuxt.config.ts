// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    devtools: { enabled: true },
    nitro: {
        preset: 'github-pages',
        prerender: {
            crawlLinks: true,
            failOnError: false,
        },
        routeRules: {
            '/**': {
                prerender: true,
                headers: {
                    'X-Frame-Options': 'DENY'
                }
            }
        }
    },
    modules: [
        "@nuxtjs/i18n",
        "@nuxtjs/color-mode",
        "@nuxt/image",
        "@nuxtjs/google-fonts",
        "@nuxtjs/device",
    ],

    image: {
        domains: ['raw.githubusercontent.com'],
    },

    i18n: {
        locales: [
            { code: 'en', file: 'en.json' },
            { code: 'de', file: 'de.json' },
            { code: 'es', file: 'es.json' },
            { code: 'fr', file: 'fr.json' },
            { code: 'id', file: 'id.json' },
            { code: 'it', file: 'it.json' },
            { code: 'ja', file: 'ja.json' },
            { code: 'pt', file: 'pt.json' },
            { code: 'ru', file: 'ru.json' },
            { code: 'zh', file: 'zh.json' },
        ],
        lazy: true,
        langDir: 'lang',
        defaultLocale: 'en',
        strategy: 'no_prefix',
        compilation: {
            strictMessage: false,
            escapeHtml: false,
        },
    },

    colorMode: {
        classSuffix: '',
        storageKey: 'color-theme',
        preference: 'system',
        fallback: 'light',
    },

    googleFonts: {
        families: {
            'Lexend': true,
        }
    },

    css: ['~/assets/css/main.css'],

    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },

    plugins: [
        { src: '~/plugins/utils.client.js', ssr: false },
    ],

    app: {
        baseURL: '/Spixi-Mini-Apps-Website/',
        pageTransition: false,
        head: {
            title: 'Spixi',
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
        },
    },

    compatibilityDate: '2025-03-14',
})