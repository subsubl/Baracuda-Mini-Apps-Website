<script setup>
import { spixiVersion } from "~/constants";
import { ref, computed, onMounted, onUnmounted } from 'vue'

const { setLocale, t, locale, locales } = useI18n()

// ⚡ Bolt Optimization: Extracted O(1) static lookup map to replace O(N) nested ternaries and dead switch code.
const LOCALE_NAMES = {
    en: "English",
    es: "Español",
    pt: "Português",
    fr: "Français",
    it: "Italiano",
    de: "Deutsch",
    ru: "Русский",
    ja: "日本語",
    zh: "中文",
    id: "Bahasa Indonesia"
};

const availableLocales = computed(() => {
    return locales.value.map(i => ({
        ...i,
        name: LOCALE_NAMES[i.code] || "Unknown",
        active: i.code === locale.value
    }))
})

const showLanguageDropdown = ref(false)
const isMenuOpen = ref(false)
const dropdownRef = ref(null)
const dropdownButtonRef = ref(null)

const toggleDropdownLanguage = () => {
    showLanguageDropdown.value = !showLanguageDropdown.value
}

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
    // Close dropdown if menu is opened (optional UX choice)
    if (isMenuOpen.value) {
        showLanguageDropdown.value = false
    }
}

const closeDropdown = (event) => {
    if (showLanguageDropdown.value &&
        dropdownRef.value &&
        !dropdownRef.value.contains(event.target) &&
        dropdownButtonRef.value &&
        !dropdownButtonRef.value.contains(event.target)) {
        showLanguageDropdown.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
    document.removeEventListener('click', closeDropdown)
})
</script>

<template>
    <header>
        <nav class="bg-transparent border-gray-200">
            <div class="max-w-screen-xl flex flex-nowrap md:flex-wrap items-center justify-between mx-auto p-4">
                <NuxtLink to="/" activeClass="font-bold" id="logo" class="flex items-center gap-3" @click="isMenuOpen = false">
                    <BaseLogo />
                    <span class="text-xl md:text-2xl font-lexend font-bold text-gray-900 dark:text-white">Mini Apps</span>
                </NuxtLink>

                <div class="flex justify-end items-center">
                    <BaseThemeSwitcher />
                    
                    <!-- Language Dropdown Wrapper -->
                    <div class="relative">
                        <button
                            ref="dropdownButtonRef"
                            type="button"
                            @click="toggleDropdownLanguage"
                            class="inline-flex items-center font-medium justify-center px-1 md:px-4 py-2 text-sm text-gray-900 dark:text-white rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white fill-current fill-spixi dark:fill-white">
                            <!-- ⚡ Bolt Optimization: Replaced large 13KB inline SVG with standardized Heroicons Globe (20x20) to reduce bundle size -->
                            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clip-rule="evenodd" />
                            </svg>
                        </button>
                        <div
                            ref="dropdownRef"
                            v-show="showLanguageDropdown"
                            class="absolute right-0 top-full mt-2 z-50 text-base list-none bg-white dark:bg-spixi divide-y divide-gray-100 rounded-lg shadow min-w-[200px]"
                            id="language-dropdown-menu">
                            <ul class="py-2 font-medium">
                                <li v-for="locale in availableLocales" :key="locale.code">
                                    <div
                                        @click="setLocale(locale.code); toggleDropdownLanguage();"
                                        :class="{
                                            'bg-spixi text-white dark:bg-[#24BBFF]': locale.active,
                                            'hover:bg-spixi hover:text-white dark:hover:bg-[#24BBFF]': !locale.active
                                        }"
                                        class="block px-4 py-2 text-sm text-spixi dark:text-white cursor-pointer">
                                        <div class="inline-flex items-center transition-none">
                                            <NuxtImg
                                                :src="`/img/countries/${locale.code}.svg`"
                                                class="me-2"
                                                width="20" />
                                            {{ locale.name }}
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <button 
                        @click="toggleMenu"
                        type="button" 
                        class="inline-flex items-center justify-center p-2 w-10 h-10 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" 
                        aria-controls="navbar-hamburger" 
                        :aria-expanded="isMenuOpen">
                        <span class="sr-only">
                            {{ t('menu.misc.hamburger.screenreader') }}
                        </span>
                        <svg width="21" height="18" viewBox="0 0 21 18" class="fill-spixi dark:fill-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                            <rect y="0.5" width="17" height="3" rx="1" />
                            <rect y="7.5" width="19" height="3" rx="1" />
                            <rect y="14.5" width="21" height="3" rx="1" />
                        </svg>
                    </button>
                </div>
            </div>

            <div
                :class="{'flex': isMenuOpen, 'hidden': !isMenuOpen}"
                class="w-full bg-gradient-to-b from-[#00000000] to-[#1A6FBD59] dark:to-[#3770a659] h-svh justify-center"
                id="navbar-hamburger">
                <div class="flex flex-col md:flex-row font-medium mt-4 rounded-lg max-w-4xl h-[calc(100%-10rem)] justify-center md:gap-40">
                    <ul class="flex flex-col justify-center">
                        <li class="py-3">
                            <NuxtLink 
                                to="/" 
                                @click="isMenuOpen = false"
                                class="block py-2 px-3 font-lexend text-4xl text-[#1D2329] dark:text-white hover:text-[#24BBFF] dark:hover:text-[#24BBFF]">
                                {{ t('menu.home') }}
                            </NuxtLink>
                        </li>
                      <li class="py-3">
                        <NuxtLink
                            to="/builder"
                            @click="isMenuOpen = false"
                            class="block py-2 px-3 font-lexend text-4xl text-[#1D2329] dark:text-white hover:text-[#24BBFF] dark:hover:text-[#24BBFF]">
                          {{ t('menu.builder') }}
                        </NuxtLink>
                      </li>
                        <li class="py-3">
                            <NuxtLink 
                                to="/howitworks" 
                                @click="isMenuOpen = false"
                                class="block py-2 px-3 font-lexend text-4xl text-[#1D2329] dark:text-white hover:text-[#24BBFF] dark:hover:text-[#24BBFF]">
                                {{ t('menu.howitworks') }}
                            </NuxtLink>
                        </li>
                        <li class="py-3">
                            <NuxtLink 
                                to="/howitworks#faq" 
                                @click="isMenuOpen = false"
                                class="block py-2 px-3 font-lexend text-4xl text-[#1D2329] dark:text-white hover:text-[#24BBFF] dark:hover:text-[#24BBFF]">
                                FAQ
                            </NuxtLink>
                        </li>
                    </ul>
                    <ul class="flex flex-col justify-center">
                        <li class="py-3">
                            <NuxtLink 
                                to="/privacy" 
                                @click="isMenuOpen = false"
                                class="block py-2 px-3 font-lexend text-4xl text-[#1D2329] dark:text-white hover:text-[#24BBFF] dark:hover:text-[#24BBFF]">
                                {{ t('menu.privacy') }}
                            </NuxtLink>
                        </li>
                        <li class="py-3">
                            <NuxtLink 
                                to="/terms" 
                                @click="isMenuOpen = false"
                                class="block py-2 px-3 font-lexend text-4xl text-[#1D2329] dark:text-white hover:text-[#24BBFF] dark:hover:text-[#24BBFF]">
                                {{ t('menu.terms') }}
                            </NuxtLink>
                        </li>
                        <li class="py-3">
                            <a 
                                href="https://www.ixian.io/" 
                                target="_blank" 
                                @click="isMenuOpen = false"
                                class="block py-2 px-3 font-lexend text-4xl text-[#1D2329] dark:text-white hover:text-[#24BBFF] dark:hover:text-[#24BBFF]">
                                {{ t('menu.ixian') }}
                            </a>
                        </li>
                        <li class="py-3">
                            <a 
                                href="https://baracuda.ent"
                                target="_blank" 
                                @click="isMenuOpen = false"
                                class="block py-2 px-3 font-lexend text-4xl text-[#1D2329] dark:text-white hover:text-[#24BBFF] dark:hover:text-[#24BBFF]">
                                {{ t('menu.baracuda') }}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>