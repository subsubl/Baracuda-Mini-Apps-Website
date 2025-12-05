<script setup>
import { ref } from 'vue'
import QrcodeVue from 'qrcode.vue'

const { t } = useI18n()

// Fetch apps data
const { data: apps } = await useFetch('/api/apps')

// Modal state
const showModal = ref(false)
const selectedApp = ref(null)

function openModal(app) {
  selectedApp.value = app
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedApp.value = null
}

// Close modal when clicking backdrop
function handleModalClick(e) {
  if (e.target.id === 'modal-backdrop') {
    closeModal()
  }
}
</script>

<template>
  <div>
    <!-- Hero Section -->
    <div class="pt-[4em] pb-4 px-[2em] max-w-7xl mx-auto">
      <div class="bg-white dark:bg-[#090B0D] rounded-2xl relative overflow-hidden">
        <img src="/img/pattern.png" class="absolute object-cover top-0 right-0 h-full opacity-50 pointer-events-none" alt="Pattern">
        <div class="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          <div class="md:w-1/2 inline-flex flex-col gap-4 justify-between item p-10">
            <h2 class="text-5xl font-lexend font-semibold text-black dark:text-spixi-dark pt-4">
              {{ t('pages.miniapps.hero.title') }}
            </h2>
            <p class="text-base text-spixi dark:text-spixi-dark mt-4" v-html="t('pages.miniapps.hero.description')">
            </p>
          </div>
          <div class="md:w-1/2 flex justify-center pr-8">
            <NuxtImg src="/img/mini-l.png" class="dark:hidden" alt="Spixi Mini Apps Light"/>
            <NuxtImg src="/img/mini-d.png" class="hidden dark:block" alt="Spixi Mini Apps Dark"/>
          </div>
        </div>
      </div>
    </div>

    <!-- App Grid -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="app in apps" :key="app.name" 
             class="app-card bg-white dark:bg-[#12171F] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 flex flex-col h-full transition-transform hover:scale-[1.02]">
          <div class="flex items-start justify-between mb-4">
            <img :src="app.icon" :alt="app.name" @error="$event.target.style.display='none'" class="w-16 h-16 rounded-xl object-cover bg-gray-100 dark:bg-gray-800">
            <span class="px-3 py-1 text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-accent rounded-full">
              {{ app.version }}
            </span>
          </div>
          <h3 class="text-xl font-bold mb-2 text-spixi dark:text-white">{{ app.name }}</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-grow">{{ app.description }}</p>
          <div class="flex gap-3 mt-auto">
            <button @click="openModal(app)" 
                    class="flex-1 bg-accent hover:bg-blue-400 text-white font-medium py-2.5 px-4 rounded-xl text-center transition-colors">
              {{ t('pages.miniapps.try') }}
            </button>
            <a :href="app.sourceUrl" target="_blank" 
               class="px-3 py-2.5 text-gray-500 hover:text-spixi dark:hover:text-white transition-colors" 
               :title="t('pages.miniapps.viewsource')">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </main>

    <!-- Spixi Summary Section -->
    <SpixiSummary />

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="showModal" 
           id="modal-backdrop"
           @click="handleModalClick"
           class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white dark:bg-[#090B0D] rounded-2xl p-6 w-[90%] max-w-md text-spixi dark:text-spixi-dark shadow-2xl"
             @click.stop>
          <div class="flex flex-col items-center gap-3">
            <h2 class="text-xl font-semibold mb-4">
              {{ t('pages.miniapps.modal.title', { name: selectedApp?.name }) }}
            </h2>

            <div class="bg-[#f0f0f0] dark:bg-[#0D141C] p-4 rounded-lg w-full flex flex-col items-center gap-1">
              <h3 class="font-medium">{{ t('pages.miniapps.modal.scan') }}</h3>
              <QrcodeVue v-if="selectedApp" 
                         :value="selectedApp.downloadUrl" 
                         :size="192" 
                         :margin="2" 
                         level="H" 
                         class="mx-auto my-4 rounded-lg bg-white p-2"/>
              <p class="text-sm text-center text-gray-500">{{ t('pages.miniapps.modal.url') }}</p>
              <p class="text-xs text-center break-all font-mono bg-white dark:bg-black/20 p-2 rounded w-full">
                {{ selectedApp?.downloadUrl }}
              </p>
            </div>

            <button @click="closeModal"
                    class="mt-2 border border-accent text-spixi dark:text-white rounded-lg px-4 py-2 hover:bg-accent hover:text-white transition-colors">
              {{ t('pages.miniapps.modal.close') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.app-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.app-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
