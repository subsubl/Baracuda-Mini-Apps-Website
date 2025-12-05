<script setup>
import { ref, computed } from 'vue'
import QrcodeVue from 'qrcode.vue'

const { t } = useI18n()

// Fetch apps data
const { data: apps, pending } = await useFetch('/api/apps')

// Search and filter state
const searchQuery = ref('')
const selectedCategory = ref('All')
const categories = ['All', 'Games', 'Productivity', 'Tools', 'Social']

// Filter method (not computed to avoid reactivity issues)
function getFilteredApps() {
  if (!apps.value) return []
  
  let result = [...apps.value] // Clone to avoid mutation
  
  // Filter by category
  if (selectedCategory.value !== 'All') {
    result = result.filter(app => app.category === selectedCategory.value)
  }
  
  // Filter by search with null safety
  if (searchQuery.value && searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(app => 
      (app.name || '').toLowerCase().includes(q) ||
      (app.description || '').toLowerCase().includes(q)
    )
  }
  
  return result
}

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
    <div class="pt-6 pb-4 px-4 md:px-8 max-w-7xl mx-auto">
      <div class="bg-hero-gradient rounded-3xl relative overflow-hidden text-white shadow-2xl">
        <img src="/img/pattern.png" class="absolute object-cover top-0 right-0 h-full opacity-30 pointer-events-none mix-blend-overlay" alt="Pattern">
        <div class="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
          <div class="md:w-1/2 inline-flex flex-col gap-6 justify-between item p-12">
            <div>
              <span class="text-accent uppercase tracking-widest text-xs font-bold mb-2 block">Spixi Mini Apps</span>
              <h2 class="text-3xl md:text-5xl font-lexend font-bold leading-tight">
                {{ t('pages.mini-apps.title') }}
              </h2>
            </div>
            <p class="text-lg text-gray-300 leading-relaxed max-w-lg">
              {{ t('pages.mini-apps.subtitle1') }} {{ t('pages.mini-apps.subtitle2') }}
            </p>
            <div class="flex gap-4 mt-2">
                 <a href="#featured" class="bg-accent hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">{{ t('pages.mini-apps.browseApps') }}</a>
                 <a href="#build" class="border border-white/20 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-medium transition-colors">{{ t('pages.mini-apps.buildYourApp') }}</a>
            </div>
          </div>
          <div class="md:w-1/2 hidden md:flex justify-center pr-8 relative">
            <div class="absolute inset-0 bg-accent/20 blur-[100px] rounded-full pointer-events-none"></div>
            <NuxtImg src="/img/mini-l.png" class="dark:hidden relative z-10 drop-shadow-2xl" alt="Spixi Mini Apps Light"/>
            <NuxtImg src="/img/mini-d.png" class="hidden dark:block relative z-10 drop-shadow-2xl" alt="Spixi Mini Apps Dark"/>
          </div>
        </div>
      </div>
      
      <!-- 3-Step How It Works Guide -->
      <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Step 1 -->
        <div class="bg-card-bg/50 rounded-2xl p-6 border border-white/5 text-center">
          <div class="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h4 class="text-white font-bold mb-2">1. Get Spixi</h4>
          <p class="text-sm text-gray-400">Download Spixi from app stores or scan QR codes below</p>
        </div>
        
        <!-- Step 2 -->
        <div class="bg-card-bg/50 rounded-2xl p-6 border border-white/5 text-center">
          <div class="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path>
            </svg>
          </div>
          <h4 class="text-white font-bold mb-2">2. Scan QR Code</h4>
          <p class="text-sm text-gray-400">Click "Try Now" on any app to get its QR code</p>
        </div>
        
        <!-- Step 3 -->
        <div class="bg-card-bg/50 rounded-2xl p-6 border border-white/5 text-center">
          <div class="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path>
            </svg>
          </div>
          <h4 class="text-white font-bold mb-2">3. Enjoy!</h4>
          <p class="text-sm text-gray-400">The app installs instantly and runs securely in Spixi</p>
        </div>
      </div>
    </div>

    <!-- App Grid -->
    <main id="featured" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="flex flex-col items-start justify-between mb-10">
          <h3 class="text-3xl font-bold text-white mb-2">{{ t('pages.mini-apps.featuredTitle') }}</h3>
          <p class="text-gray-400">{{ t('pages.mini-apps.featuredDesc') }}</p>
      </div>

      <!-- Search and Filter Section -->
      <div class="mb-8 space-y-4">
        <!-- Search Bar -->
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search apps by name or description..."
            class="w-full px-5 py-3 pl-12 bg-card-bg border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 transition-colors"
          />
          <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>

        <!-- Category Filters -->
        <div class="flex flex-wrap gap-2">
          <button
            v-for="category in categories"
            :key="category"
            @click="selectedCategory = category"
            :class="[
              'px-4 py-2 rounded-lg font-medium text-sm transition-all',
              selectedCategory === category
                ? 'bg-accent text-white'
                : 'bg-card-bg text-gray-400 hover:bg-white/5 hover:text-white border border-white/10'
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="bg-card-bg rounded-2xl p-6 border border-white/5 animate-pulse">
          <div class="flex items-start justify-between mb-5">
            <div class="w-14 h-14 bg-white/10 rounded-xl"></div>
            <div class="w-16 h-6 bg-white/10 rounded"></div>
          </div>
          <div class="h-6 bg-white/10 rounded mb-3 w-3/4"></div>
          <div class="h-4 bg-white/10 rounded mb-2"></div>
          <div class="h-4 bg-white/10 rounded w-5/6"></div>
        </div>
      </div>

      <!-- No Results State -->
      <div v-else-if="apps && getFilteredApps().length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-2xl font-bold text-white mb-2">No apps found</h3>
        <p class="text-gray-400 mb-6">Try adjusting your search or filters</p>
        <button
          @click="searchQuery = ''; selectedCategory = 'All'"
          class="px-6 py-3 bg-accent hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
        >
          Clear Filters
        </button>
      </div>

      <!-- App Cards Grid -->
      <div v-else-if="apps" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="app in getFilteredApps()" :key="app.id" 
             @click="openModal(app)"
             class="app-card bg-card-bg rounded-2xl p-6 border border-white/5 hover:border-accent/50 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-accent/10 group cursor-pointer">
          <div class="flex items-start justify-between mb-3">
            <div class="relative">
                <div class="absolute inset-0 bg-accent/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <img :src="app.icon" :alt="app.name" @error="$event.target.style.display='none'" class="relative w-14 h-14 rounded-xl object-cover bg-[#1A202C]">
            </div>
            <div class="flex flex-col items-end gap-1">
              <span class="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider bg-white/5 text-gray-400 rounded-md border border-white/5">
                v{{ app.version }}
              </span>
            </div>
          </div>
          
          <!-- Category and Status Badges -->
          <div class="flex flex-wrap gap-1.5 mb-3">
            <span class="px-2 py-1 text-[10px] font-semibold rounded-md bg-accent/20 text-accent border border-accent/30">
              {{ app.category }}
            </span>
            <span v-if="app.isPopular" class="px-2 py-1 text-[10px] font-semibold rounded-md bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              ⭐ Popular
            </span>
            <span v-if="app.isNew" class="px-2 py-1 text-[10px] font-semibold rounded-md bg-green-500/20 text-green-400 border border-green-500/30">
           ✨ New
            </span>
          </div>
          
          <h3 class="text-lg font-bold mb-2 text-white group-hover:text-accent transition-colors">{{ app.name }}</h3>
          <p class="text-gray-400 text-sm mb-4 flex-grow leading-relaxed line-clamp-2">{{ app.description }}</p>
          
          <!-- Install Count -->
          <div class="text-xs text-gray-500 mb-4">
            {{ app.installCount }}+ installs
          </div>
          
          <div class="flex gap-3 mt-auto">
            <button @click.stop="openModal(app)" 
                    class="flex-1 bg-white/5 hover:bg-white/10 text-white rounded-xl py-2.5 px-4 font-medium text-sm text-center transition-all border border-white/5 hover:border-white/20">
              {{ t('pages.mini-apps.tryNow') }}
            </button>
            <a :href="app.sourceUrl" target="_blank" 
               @click.stop
               class="px-3 py-2.5 text-gray-500 hover:text-white transition-colors bg-transparent hover:bg-white/5 rounded-xl" 
               :title="t('pages.mini-apps.viewsource')">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </main>

    <!-- Build Section -->
    <section id="build" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div class="absolute inset-0 bg-accent/5 rounded-3xl -z-10 translate-y-20 mx-4"></div>
        
        <div class="flex flex-col lg:flex-row gap-16 mb-20 items-center">
            <div class="lg:w-1/2">
                <span class="text-accent uppercase tracking-widest text-xs font-bold mb-4 block">Developers</span>
                <h2 class="text-4xl font-lexend font-bold text-white mb-6 leading-tight">{{ t('pages.mini-apps.build.title') }}</h2>
                <p class="text-lg text-gray-400 mb-10 leading-relaxed">{{ t('pages.mini-apps.build.description') }}</p>
                
                <div class="space-y-8">
                    <div class="flex gap-4">
                        <div class="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent">
                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                        </div>
                        <div>
                            <h4 class="text-white font-bold mb-1">{{ t('pages.mini-apps.build.features.hardware.title') }}</h4>
                            <p class="text-sm text-gray-500">{{ t('pages.mini-apps.build.features.hardware.desc') }}</p>
                        </div>
                    </div>
                    <div class="flex gap-4">
                        <div class="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path></svg>
                        </div>
                        <div>
                            <h4 class="text-white font-bold mb-1">{{ t('pages.mini-apps.build.features.payment.title') }}</h4>
                            <p class="text-sm text-gray-500">{{ t('pages.mini-apps.build.features.payment.desc') }}</p>
                        </div>
                    </div>
                     <div class="flex gap-4">
                        <div class="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 text-accent">
                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                        </div>
                        <div>
                            <h4 class="text-white font-bold mb-1">{{ t('pages.mini-apps.build.features.distribution.title') }}</h4>
                            <p class="text-sm text-gray-500">{{ t('pages.mini-apps.build.features.distribution.desc') }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="lg:w-1/2 flex justify-center relative">
                 <div class="absolute inset-0 bg-blue-500/20 blur-[80px] rounded-full pointer-events-none"></div>
                 <!-- Using a placeholder or reusing pattern for abstract visual -->
                 <div class="relative w-full h-[400px] border border-white/5 bg-card-bg/50 backdrop-blur rounded-2xl p-8 flex items-center justify-center overflow-hidden">
                    <pre class="text-xs text-gray-500 font-mono opacity-50">
&lt;spixi-app id="my.app"&gt;
  &lt;name&gt;Awesome App&lt;/name&gt;
  &lt;version&gt;1.0.0&lt;/version&gt;
  ...
  &lt;script&gt;
     spixi.init();
     spixi.payment.request(...);
  &lt;/script&gt;
&lt;/spixi-app&gt;
                    </pre>
                    <div class="absolute top-0 right-0 p-4">
                        <div class="flex gap-2">
                            <div class="w-3 h-3 rounded-full bg-red-400"></div>
                            <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div class="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                    </div>
                 </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Documentation -->
            <div class="bg-card-bg rounded-2xl p-8 border border-white/5 hover:border-accent/40 transition-colors">
                <div class="mb-4 text-white">
                   <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <h3 class="text-white font-bold text-xl mb-2">{{ t('pages.mini-apps.build.cards.docs.title') }}</h3>
                <p class="text-gray-400 text-sm mb-6">{{ t('pages.mini-apps.build.cards.docs.desc') }}</p>
                <a href="https://ixian.io" target="_blank" class="text-accent hover:text-white font-medium text-sm flex items-center gap-1 transition-colors">
                    {{ t('pages.mini-apps.build.cards.docs.btn') }} &rarr;
                </a>
            </div>

            <!-- GitHub -->
            <div class="bg-card-bg rounded-2xl p-8 border border-white/5 hover:border-accent/40 transition-colors">
                 <div class="mb-4 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </div>
                <h3 class="text-white font-bold text-xl mb-2">{{ t('pages.mini-apps.build.cards.github.title') }}</h3>
                <p class="text-gray-400 text-sm mb-6">{{ t('pages.mini-apps.build.cards.github.desc') }}</p>
                <a href="https://github.com/ixian-platform/Spixi-Mini-Apps" target="_blank" class="text-accent hover:text-white font-medium text-sm flex items-center gap-1 transition-colors">
                    {{ t('pages.mini-apps.build.cards.github.btn') }} &rarr;
                </a>
            </div>

            <!-- Packer -->
            <div class="bg-card-bg rounded-2xl p-8 border border-white/5 hover:border-accent/40 transition-colors">
                 <div class="mb-4 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16.5 9.4 7.5 4.21 7.5 14.79 16.5 20 16.5 9.4"></polyline><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </div>
                <h3 class="text-white font-bold text-xl mb-2">{{ t('pages.mini-apps.build.cards.packer.title') }}</h3>
                <p class="text-gray-400 text-sm mb-6">{{ t('pages.mini-apps.build.cards.packer.desc') }}</p>
                <NuxtLink to="/builder" class="text-accent hover:text-white font-medium text-sm flex items-center gap-1 transition-colors">
                    {{ t('pages.mini-apps.build.cards.packer.btn') }} &rarr;
                </NuxtLink>
            </div>
        </div>
    </section>

    <!-- Spixi Summary/Footer CTA -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="bg-hero-gradient rounded-3xl relative overflow-hidden text-white shadow-2xl p-12 flex flex-col md:flex-row items-center justify-between">
           <img src="/img/pattern.png" class="absolute object-cover top-0 left-0 w-full h-full opacity-20 pointer-events-none mix-blend-overlay" alt="Pattern">
           <div class="md:w-1/2 relative z-10">
               <h2 class="text-4xl font-lexend font-bold mb-4">{{ t('pages.mini-apps.cta.title') }}</h2>
               <p class="text-lg text-gray-300 mb-8 max-w-md">{{ t('pages.mini-apps.cta.desc') }}</p>
                
               <a href="https://www.spixi.io" target="_blank" class="inline-block bg-accent hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold transition-colors">
                   {{ t('pages.mini-apps.cta.btn') }}
               </a>
               <p class="mt-4 text-xs text-gray-500">{{ t('pages.mini-apps.cta.note') }}</p>
           </div>
           <div class="md:w-1/2 relative z-10 flex justify-end mt-10 md:mt-0">
               <!-- Reusing SpixiSummary Logic or Image -->
                <NuxtImg class="w-[400px] drop-shadow-2xl" src="/img/SpixiSummaryDark.png" />
           </div>
        </div>
    </div>
    
    <!-- Modal -->
    <Teleport to="body">
      <div v-if="showModal" 
           id="modal-backdrop"
           @click="handleModalClick"
           class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="relative bg-white dark:bg-[#090B0D] rounded-2xl p-8 w-[90%] max-w-md text-spixi dark:text-spixi-dark shadow-2xl overflow-hidden"
             @click.stop>
          <!-- Blurred Icon Background -->
          <div class="absolute inset-0 overflow-hidden">
            <img v-if="selectedApp?.icon" 
                 :src="selectedApp.icon" 
                 class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover opacity-10 blur-3xl scale-150"
                 @error="$event.target.style.display='none'">
          </div>
          
          <!-- Modal Content -->
          <div class="relative z-10 flex flex-col items-center gap-4">
            <!-- App Icon -->
            <div class="w-20 h-20 rounded-2xl overflow-hidden bg-[#1A202C] shadow-xl mb-2">
              <img v-if="selectedApp?.icon" 
                   :src="selectedApp.icon" 
                   :alt="selectedApp?.name"
                   class="w-full h-full object-cover"
                   @error="$event.target.style.display='none'">
            </div>
            
            <!-- App Name -->
            <h2 class="text-2xl font-bold text-center">
              {{ selectedApp?.name }}
            </h2>
            
            <!-- App Description -->
            <p class="text-sm text-gray-600 dark:text-gray-400 text-center max-w-sm leading-relaxed">
              {{ selectedApp?.description || 'Discover this amazing mini app on Spixi!' }}
            </p>
            
            <!-- Publisher & Version -->
            <div class="flex gap-4 text-xs text-gray-500">
              <span v-if="selectedApp?.publisher">{{ selectedApp.publisher }}</span>
              <span v-if="selectedApp?.version">v{{ selectedApp.version }}</span>
            </div>

            <!-- QR Code Section -->
            <div class="bg-[#f0f0f0] dark:bg-[#0D141C] p-6 rounded-xl w-full flex flex-col items-center gap-2 mt-4">
              <h3 class="font-medium text-sm">{{ t('pages.mini-apps.scanQr') }}</h3>
              <QrcodeVue v-if="selectedApp" 
                         :value="selectedApp.downloadUrl" 
                         :size="180" 
                         :margin="2" 
                         level="H" 
                         class="mx-auto my-2 rounded-lg bg-white p-2"/>
              <p class="text-xs text-center text-gray-500 mt-2">{{ t('pages.mini-apps.addFromUrl') }}</p>
              <p class="text-xs text-center break-all font-mono bg-white dark:bg-black/20 p-2 rounded w-full">
                {{ selectedApp?.downloadUrl }}
              </p>
            </div>

            <!-- Close Button -->
            <button @click="closeModal"
                    class="mt-4 w-full border border-accent text-spixi dark:text-white rounded-lg px-6 py-3 hover:bg-accent hover:text-white transition-colors font-medium">
              {{ t('pages.mini-apps.close') }}
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
