<script setup>
const props = defineProps({
    image: String,
    title: String,
    description: String
})

let images = {
    light: props.image.replace('.svg', 'Light.svg'),
    dark: props.image.replace('.svg', 'Dark.svg')
}
</script>

<template>
    <div class="flex flex-col items-left justify-center dark:text-white">
        <!-- ⚡ Bolt Optimization: Use CSS visibility classes instead of v-if="$colorMode.value === '...'" for SSR -->
        <NuxtImg v-if="images.light" :src="images.light" class="w-[180px] h-auto block dark:hidden" />
        <NuxtImg v-if="images.dark" :src="images.dark" class="w-[180px] h-auto hidden dark:block" />
        <h3 class="text-2xl font-lexend font-medium pt-10 pb-6">{{ title }}</h3>
        <p class="text-base">{{ description }}</p>
    </div>
</template>