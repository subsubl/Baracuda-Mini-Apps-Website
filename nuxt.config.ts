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
                    'X-Frame-Options': 'SAMEORIGIN'
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
        preference: 'dark',
        fallback: 'dark',
    },

    googleFonts: {
        families: {
            'Lexend': true,
            'Inter': true,
        }
    },

    css: ['~/assets/css/main.css'],

    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },

    app: {
        baseURL: process.env.NUXT_APP_BASE_URL || '/',
        pageTransition: false,
        head: {
            title: 'Baracuda Mini Apps | Unofficial Spixi Mini Apps Hub',
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            meta: [
                { name: 'description', content: 'Explore, package, and test unofficial Baracuda Mini Apps for Spixi decentralized messenger.' },
                { name: 'theme-color', content: '#0B0F19' }
            ]
        },
    },

    compatibilityDate: '2025-03-14',
})