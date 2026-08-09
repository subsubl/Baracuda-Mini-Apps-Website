<script setup>
const props = defineProps({
    id: String,
    question: String,
    answer: {
        type: String,
        default: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec libero ultricies aliquam. Nullam nec purus nec libero ultricies aliquam."
    }
})
</script>
<template>
    <label :for="id" class="text-3xl font-lexend text-black dark:text-spixi-dark w-full">
        <input type="checkbox" :id="id" class="sr-only peer">
        <div class="flex flex-col justify-center col-span-5 py-3 border-b border-[#767E87] peer-checked:border-[#24BBFF] peer-checked:[&>.hidden]:block peer-checked:[&>div>.plus]:hidden peer-checked:[&>div>.minus]:block ">
            <div class="flex flex-row">
                <h3 class="w-full text-lg">
                    {{ question }}
                </h3>
                <!-- ⚡ Bolt Optimization: Replaced large unoptimized mask-based SVGs from design tools with lightweight standard stroke SVGs (Heroicons) to reduce DOM size and HTML payload. -->
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="plus peer-checked:hidden text-[#1D2329] dark:text-[#D9D9D9]">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>

                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hidden minus peer-checked:block text-[#1D2329] dark:text-[#D9D9D9]">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </div>
            <div class="hidden pt-4 overflow-hidden ease duration-500">
                <p class="text-base text-spixi dark:text-spixi-dark" v-html="answer">
                </p>
            </div>
        </div>
    </label>
</template>