<script setup>
defineProps({
    width: {
        type: String,
        default: '160px',
    },
    height: {
        type: String,
        default: '36px',
    },
})
</script>

<template>
  <div class="flex items-center gap-2.5 group cursor-pointer select-none">
    <!-- Baracuda Shield & Circuit Emblem -->
    <div class="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
      <div class="w-full h-full bg-[#0F172A] rounded-[10px] flex items-center justify-center relative overflow-hidden">
        <!-- Subtle Glow Layer -->
        <div class="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-cyan-400/20 opacity-80"></div>
        <!-- Stylized B Emblem SVG -->
        <svg class="w-5 h-5 relative z-10 text-white fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 3h7.5a4.5 4.5 0 0 1 3.5 7.3A5 5 0 0 1 12.5 21H4V3zm4 4v4h3.5a1.5 1.5 0 0 0 0-3H8zm0 7v4h4.5a2 2 0 0 0 0-4H8z"/>
          <circle cx="19" cy="6" r="1.5" class="fill-cyan-400" />
          <circle cx="19" cy="18" r="1.5" class="fill-blue-400" />
        </svg>
      </div>
    </div>
    <!-- Typography -->
    <div class="flex flex-col">
      <span class="font-lexend font-extrabold text-lg tracking-wider text-white leading-none group-hover:text-blue-400 transition-colors">
        BARACUDA
      </span>
      <span class="text-[9px] font-mono font-semibold text-blue-400 uppercase tracking-widest leading-tight mt-0.5">
        P2P MINI APPS
      </span>
    </div>
  </div>
</template>