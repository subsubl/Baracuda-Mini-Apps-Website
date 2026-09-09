<script setup>
import { ref, computed, defineAsyncComponent, watch, onBeforeUnmount } from 'vue'
import AppSimulatorModal from '~/components/AppSimulatorModal.vue'

// Lazy load QrcodeVue to reduce initial bundle size
const QrcodeVue = defineAsyncComponent(() => import('qrcode.vue'))

const { t } = useI18n()

// Fetch apps data
const { data: apps, pending } = await useFetch('/api/apps', {
  transform: (apps) => apps.map(app => ({
    ...app,
    _searchName: (app.name || '').toLowerCase(),
    _searchDesc: (app.description || '').toLowerCase()
  }))
})

// Search and filter state
const searchQuery = ref('')
const debouncedSearchQuery = ref('')
const selectedCategory = ref('All')
const categories = ['All', 'Games', 'Productivity', 'Tools', 'Social']

// Debounce search
let debounceTimer = null
watch(searchQuery, (newVal) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedSearchQuery.value = newVal
  }, 300)
})

onBeforeUnmount(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})

// Filtered apps
const filteredApps = computed(() => {
  if (!apps.value) return []

  const category = selectedCategory.value
  const query = debouncedSearchQuery.value ? debouncedSearchQuery.value.trim().toLowerCase() : ''

  if (category === 'All' && !query) {
    return apps.value
  }

  return apps.value.filter(app => {
    if (category !== 'All' && app.category !== category) return false
    if (query) {
      if (!app._searchName.includes(query) && !app._searchDesc.includes(query)) return false
    }
    return true
  })
})

// Modal state
const showModal = ref(false)
const selectedApp = ref(null)

// Simulator state
const showSimulatorModal = ref(false)
const testingApp = ref(null)

function openModal(app) {
  selectedApp.value = app
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedApp.value = null
}

function startSimulator(app) {
  testingApp.value = app
  showSimulatorModal.value = true
}

function handleModalClick(e) {
  if (e.target.id === 'modal-backdrop') {
    closeModal()
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#0B0F19] text-gray-100 font-sans">
    <!-- Hero Section -->
    <div class="pt-8 pb-4 px-4 md:px-8 max-w-7xl mx-auto">
      <div class="bg-gradient-to-r from-gray-900 via-blue-950/40 to-gray-900 border border-gray-800 rounded-3xl relative overflow-hidden text-white shadow-2xl p-8 md:p-12">
        <NuxtImg src="/img/pattern.png" class="absolute object-cover top-0 right-0 h-full opacity-20 pointer-events-none mix-blend-overlay" alt="Pattern" format="webp" />
        <div class="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          <div class="md:w-3/5 inline-flex flex-col gap-6 justify-between">
            <div>
              <span class="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full uppercase tracking-widest text-xs font-bold mb-3 inline-block">
                Unofficial Spixi Mini Apps Hub
              </span>
              <h1 class="text-3xl md:text-5xl font-lexend font-extrabold leading-tight tracking-tight text-white">
                Baracuda <span class="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Mini Apps</span>
              </h1>
            </div>
            <p class="text-lg text-gray-300 leading-relaxed max-w-2xl">
              Explore, test live in your browser, and build decentralized, peer-to-peer web mini apps for Spixi messenger and Baracuda ecosystem.
            </p>
            <div class="flex flex-wrap gap-4 mt-2">
              <a href="#featured" class="glow-button text-white px-6 py-3.5 rounded-xl font-bold transition-transform flex items-center gap-2">
                <span>⚡ Browse Catalog</span>
              </a>
              <NuxtLink to="/builder" class="bg-gray-800/80 hover:bg-gray-700 text-gray-200 border border-gray-700 px-6 py-3.5 rounded-xl font-semibold transition-colors flex items-center gap-2">
                <span>📦 Open App Packer</span>
              </NuxtLink>
            </div>
          </div>

          <div class="md:w-2/5 hidden md:flex justify-center relative">
            <div class="w-72 h-72 bg-blue-600/20 blur-[90px] rounded-full absolute pointer-events-none"></div>
            <NuxtImg
              src="/img/mini-d.png"
              class="relative z-10 drop-shadow-2xl max-w-sm rounded-2xl border border-gray-800"
              alt="Baracuda Mini Apps"
              format="webp"
            />
          </div>
        </div>
      </div>
      
      <!-- 3-Step Guide -->
      <div class="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="glass-card rounded-2xl p-6 text-center border border-gray-800">
          <div class="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30 text-2xl">
            📱
          </div>
          <h3 class="text-white font-bold text-base mb-1">1. Get Spixi</h3>
          <p class="text-xs text-gray-400">Install Spixi decentralized messenger on Android or iOS</p>
        </div>
        
        <div class="glass-card rounded-2xl p-6 text-center border border-gray-800">
          <div class="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/30 text-2xl">
            🧪
          </div>
          <h3 class="text-white font-bold text-base mb-1">2. Test Live</h3>
          <p class="text-xs text-gray-400">Click "Test Live" on any app to simulate in your browser</p>
        </div>
        
        <div class="glass-card rounded-2xl p-6 text-center border border-gray-800">
          <div class="w-14 h-14 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-500/30 text-2xl">
            🚀
          </div>
          <h3 class="text-white font-bold text-base mb-1">3. Scan & Enjoy</h3>
          <p class="text-xs text-gray-400">Scan QR codes directly inside Spixi to add any app instantly</p>
        </div>
      </div>
    </div>

    <!-- App Grid Section -->
    <main id="featured" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 class="text-2xl md:text-3xl font-extrabold text-white">Baracuda Mini Apps Catalog</h2>
          <p class="text-sm text-gray-400">High-performance P2P mini apps ready for testing & installation.</p>
        </div>
      </div>

      <!-- Search & Category Filters -->
      <div class="mb-8 space-y-4">
        <div class="relative max-w-2xl">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search mini apps by name, description or author..."
            class="w-full px-5 py-3.5 pl-12 bg-gray-900/90 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/80 transition-colors text-sm"
          />
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            v-for="category in categories"
            :key="category"
            @click="selectedCategory = category"
            :class="[
              'px-4 py-2 rounded-xl text-xs font-semibold transition-all',
              selectedCategory === category
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-900/80 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-800'
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="glass-card rounded-2xl p-6 border border-gray-800 animate-pulse h-48"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="apps && filteredApps.length === 0" class="text-center py-16 glass-panel rounded-2xl border border-gray-800 max-w-md mx-auto">
        <div class="text-5xl mb-3">🔍</div>
        <h3 class="text-xl font-bold text-white mb-1">No apps found</h3>
        <p class="text-xs text-gray-400 mb-5">Try resetting search keywords or category filters.</p>
        <button @click="searchQuery = ''; selectedCategory = 'All'" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors">
          Reset Filters
        </button>
      </div>

      <!-- App Grid -->
      <div v-else-if="apps" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="app in filteredApps"
          :key="app.id"
          class="glass-card rounded-2xl p-6 border border-gray-800/80 hover:border-blue-500/40 flex flex-col justify-between group transition-all duration-200"
        >
          <div>
            <!-- Card Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <img
                  :src="app.icon"
                  :alt="app.name"
                  class="w-14 h-14 rounded-2xl object-cover border border-gray-700 bg-gray-900 group-hover:scale-105 transition-transform"
                  @error="$event.target.src='/img/default-icon.png'"
                />
                <div>
                  <h3 class="text-lg font-bold text-white group-hover:text-blue-400 transition-colors leading-tight">
                    {{ app.name }}
                  </h3>
                  <span class="text-xs text-gray-400 font-mono">{{ app.publisher || 'Baracuda' }}</span>
                </div>
              </div>

              <span class="px-2 py-1 text-[10px] font-mono text-gray-400 bg-gray-900 border border-gray-800 rounded-md">
                v{{ app.version }}
              </span>
            </div>

            <!-- Badges -->
            <div class="flex flex-wrap gap-1.5 mb-3">
              <span v-if="app.category" class="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {{ app.category }}
              </span>
              <span v-if="app.isPopular" class="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                🔥 Popular
              </span>
              <span v-if="app.isNew" class="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ✨ New
              </span>
            </div>

            <p class="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-4">
              {{ app.description }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 pt-4 border-t border-gray-800/60 mt-2">
            <button
              @click="startSimulator(app)"
              class="flex-1 px-3 py-2.5 bg-blue-600/90 hover:bg-blue-600 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20"
            >
              <span>🧪 Test Live</span>
            </button>
            <button
              @click="openModal(app)"
              class="px-3 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 rounded-xl font-medium text-xs transition-colors"
              title="View QR Code & Download"
            >
              QR Code
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- App Details / QR Modal -->
    <Teleport to="body">
      <div v-if="showModal" id="modal-backdrop" @click="handleModalClick" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="glass-panel w-full max-w-md rounded-2xl p-6 border border-gray-700 shadow-2xl relative" @click.stop>
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <img :src="selectedApp?.icon" :alt="selectedApp?.name" class="w-12 h-12 rounded-xl object-cover border border-gray-700 bg-gray-900" />
              <div>
                <h3 class="text-xl font-bold text-white">{{ selectedApp?.name }}</h3>
                <p class="text-xs text-gray-400 font-mono">{{ selectedApp?.id }}</p>
              </div>
            </div>
            <button @click="closeModal" class="text-gray-400 hover:text-white p-1">✕</button>
          </div>

          <p class="text-xs text-gray-300 leading-relaxed mb-4">{{ selectedApp?.description }}</p>

          <div class="bg-black/60 p-4 rounded-xl border border-gray-800 text-center mb-4">
            <p class="text-xs font-semibold text-gray-400 mb-3">Scan with Spixi Messenger to Install</p>
            <QrcodeVue v-if="selectedApp" :value="selectedApp.downloadUrl" :size="160" :margin="2" level="H" class="mx-auto rounded-lg bg-white p-2" />
            <p class="text-[11px] text-gray-500 font-mono mt-2 break-all">{{ selectedApp?.downloadUrl }}</p>
          </div>

          <div class="flex gap-2">
            <button @click="closeModal(); startSimulator(selectedApp)" class="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors">
              🧪 Launch Simulator
            </button>
            <a v-if="selectedApp?.zipUrl" :href="selectedApp.zipUrl" download class="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center">
              Download .zip
            </a>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Interactive Simulator Modal -->
    <AppSimulatorModal
      :is-open="showSimulatorModal"
      :app="testingApp"
      @close="showSimulatorModal = false"
    />
  </div>
</template>
