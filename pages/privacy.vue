<script setup>
import { computed } from 'vue'

const { t, te, tm } = useI18n()

useHead({
    title: t('pages.privacy.title') + " | Spixi",
    meta: [
        {
            name: 'description',
            content: t('pages.privacy.title')
        }
    ]
})

const privacySections = computed(() => tm('pages.privacy.sections') || [])

</script>

<template>
    <div class="pt-6 pb-4 px-4 md:px-8 max-w-7xl mx-auto">
        <h1 class="font-lexend text-3xl md:text-5xl font-semibold text-black dark:text-spixi-dark leading-normal text-center">
            {{ t('pages.privacy.title') }}
        </h1>
        <h3 class="font-lexend font-semibold text-black dark:text-spixi-dark text-center mt-4" v-if="te('pages.privacy.translation')">
            {{ t('pages.privacy.translation') }}
        </h3>

        <div class="flex flex-col gap-4 my-16 text-[#1D2329] dark:text-[#F0F2F4] max-w-4xl mx-auto">
            <template v-for="(section, sIndex) in privacySections" :key="sIndex">
                <h2 v-if="section.title" class="font-semibold text-2xl">
                    {{ section.title }}
                </h2>
                <template v-for="(block, bIndex) in section.content" :key="bIndex">
                    <!-- String -> Paragraph -->
                    <p v-if="typeof block === 'string'" v-html="block"></p>

                    <!-- Array -> List -->
                    <ul v-else-if="Array.isArray(block)" class="list-disc pl-8">
                        <li v-for="(item, iIndex) in block" :key="iIndex">
                            {{ item }}
                        </li>
                    </ul>

                    <!-- Object -> Subsection H3 -->
                    <h3 v-else-if="typeof block === 'object' && block.type === 'h3'" class="font-semibold text-xl">
                        {{ block.text }}
                    </h3>
                </template>
            </template>
        </div>
    </div>
</template>
