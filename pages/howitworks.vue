<script setup>

const { t } = useI18n()

useHead({
    title: "How It Works & Developer Documentation | Baracuda P2P Mini Apps",
    meta: [
        {
            name: 'description',
            content: 'Technical architecture, SDK documentation, P2P event loop specification and integration guide for Baracuda and Spixi P2P Mini Apps.'
        }
    ]
})
</script>

<template>
    <div class="pt-6 pb-4 px-4 md:px-8 max-w-7xl mx-auto font-sans">

        <!-- Hero Section -->
        <div class="bg-gradient-to-r from-gray-900 via-blue-950/40 to-gray-900 border border-gray-800 rounded-3xl mb-16 overflow-hidden relative shadow-2xl">
            <div class="flex flex-col md:flex-row items-center justify-between py-16 px-8 md:px-12 gap-10 relative z-10">
                <div class="md:w-3/5 inline-flex flex-col justify-between">
                    <span class="text-blue-400 uppercase tracking-widest text-xs font-bold mb-3 block">Architecture & Developer Guide</span>
                    <h1 class="text-3xl md:text-5xl font-lexend font-bold text-white leading-tight">
                        How Baracuda Mini Apps Work
                    </h1>
                    <p class="text-base md:text-lg text-gray-300 mt-6 leading-relaxed max-w-xl">
                        Discover the peer-to-peer event bridge, sandboxed HTML5/JS runtime environment, and decentralized Ixian network protocol behind Baracuda Mini Apps.
                    </p>
                </div>
                <div class="md:w-2/5 hidden md:flex justify-center">
                   <div class="relative w-64 h-64">
                       <div class="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full animate-pulse"></div>
                       <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-blue-400 relative z-10 drop-shadow-xl">
                           <circle cx="100" cy="100" r="40" fill="currentColor" opacity="0.2" />
                           <circle cx="100" cy="100" r="25" fill="currentColor" />
                           <circle cx="40" cy="50" r="10" fill="currentColor" opacity="0.6" />
                           <circle cx="160" cy="50" r="10" fill="currentColor" opacity="0.6" />
                           <circle cx="40" cy="150" r="10" fill="currentColor" opacity="0.6" />
                           <circle cx="160" cy="150" r="10" fill="currentColor" opacity="0.6" />
                           <line x1="100" y1="100" x2="40" y2="50" stroke="currentColor" stroke-width="2" opacity="0.4" />
                           <line x1="100" y1="100" x2="160" y2="50" stroke="currentColor" stroke-width="2" opacity="0.4" />
                           <line x1="100" y1="100" x2="40" y2="150" stroke="currentColor" stroke-width="2" opacity="0.4" />
                           <line x1="100" y1="100" x2="160" y2="150" stroke="currentColor" stroke-width="2" opacity="0.4" />
                       </svg>
                   </div>
                </div>
            </div>
        </div>

        <!-- Helper Section -->
        <Helper
            :title="t('pages.howitworks.helper')"
            :subtitle="t('pages.howitworks.helperdesc')"
            class="mb-20"
        />

        <!-- Steps / Ecology Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <!-- Step 1 -->
            <div class="glass-card p-8 rounded-2xl border border-gray-800 hover:border-blue-500/40 transition-colors">
                <div class="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-6 text-2xl border border-blue-500/30">
                    ⚡
                </div>
                <h3 class="text-xl font-bold text-white mb-3">{{ t('pages.howitworks.steps.step1.title') }}</h3>
                <p class="text-gray-400 leading-relaxed text-sm">{{ t('pages.howitworks.steps.step1.content') }}</p>
            </div>

             <!-- Step 2 -->
             <div class="glass-card p-8 rounded-2xl border border-gray-800 hover:border-blue-500/40 transition-colors">
                <div class="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mb-6 text-2xl border border-emerald-500/30">
                    🧪
                </div>
                <h3 class="text-xl font-bold text-white mb-3">{{ t('pages.howitworks.steps.step2.title') }}</h3>
                <p class="text-gray-400 leading-relaxed text-sm">{{ t('pages.howitworks.steps.step2.content') }}</p>
            </div>

             <!-- Step 3 -->
             <div class="glass-card p-8 rounded-2xl border border-gray-800 hover:border-blue-500/40 transition-colors">
                <div class="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center mb-6 text-2xl border border-purple-500/30">
                    👥
                </div>
                <h3 class="text-xl font-bold text-white mb-3">{{ t('pages.howitworks.steps.step3.title') }}</h3>
                <p class="text-gray-400 leading-relaxed text-sm">{{ t('pages.howitworks.steps.step3.content') }}</p>
            </div>

             <!-- Step 4 -->
             <div class="glass-card p-8 rounded-2xl border border-gray-800 hover:border-blue-500/40 transition-colors">
                <div class="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center mb-6 text-2xl border border-amber-500/30">
                    🔒
                </div>
                <h3 class="text-xl font-bold text-white mb-3">{{ t('pages.howitworks.steps.step4.title') }}</h3>
                <p class="text-gray-400 leading-relaxed text-sm">{{ t('pages.howitworks.steps.step4.content') }}</p>
            </div>
        </div>

        <!-- Architecture Diagram Section -->
        <div class="mb-20">
             <div class="text-center mb-10">
                <h2 class="text-3xl font-lexend font-bold text-white">System Architecture & Event Loop</h2>
                <p class="text-sm text-gray-400 mt-2">How mini apps interface with the host client and Ixian P2P streaming nodes</p>
            </div>
            
            <div class="glass-panel border border-gray-800 rounded-3xl p-6 md:p-10">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-6 items-center text-center">
                     <div class="p-6 bg-gray-900 border border-gray-800 rounded-2xl">
                         <div class="text-3xl mb-2">📱</div>
                         <h4 class="font-bold text-white text-sm mb-1">Spixi / Baracuda Host</h4>
                         <p class="text-[11px] text-gray-400">Native messenger runtime & key management</p>
                     </div>

                     <div class="p-6 bg-blue-950/40 border border-blue-800/60 rounded-2xl">
                         <div class="text-3xl mb-2">🌉</div>
                         <h4 class="font-bold text-blue-400 text-sm mb-1">spixi-app-sdk.js</h4>
                         <p class="text-[11px] text-gray-400">postMessage event bridge & RPC layer</p>
                     </div>

                     <div class="p-6 bg-gray-900 border border-gray-800 rounded-2xl">
                         <div class="text-3xl mb-2">🚀</div>
                         <h4 class="font-bold text-white text-sm mb-1">Sandboxed HTML5 App</h4>
                         <p class="text-[11px] text-gray-400">Lightweight client UI (Canvas, Web Audio, DOM)</p>
                     </div>

                     <div class="p-6 bg-emerald-950/40 border border-emerald-800/60 rounded-2xl">
                         <div class="text-3xl mb-2">🌐</div>
                         <h4 class="font-bold text-emerald-400 text-sm mb-1">Ixian P2P Stream</h4>
                         <p class="text-[11px] text-gray-400">End-to-end encrypted packet stream</p>
                     </div>
                </div>
            </div>
        </div>

        <!-- Developer Documentation & SDK Specification -->
        <div id="docs" class="mb-20 glass-panel border border-gray-800 rounded-3xl p-8 md:p-12">
          <div class="flex items-center gap-3 mb-6">
            <span class="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
              Developer Reference
            </span>
            <h2 class="text-2xl md:text-3xl font-extrabold text-white">Mini App SDK Specification</h2>
          </div>

          <p class="text-sm text-gray-300 leading-relaxed mb-8">
            Baracuda Mini Apps are static web applications packaged into lightweight `.spixi` bundles. They communicate with the host client using standard window events registered through <code class="text-blue-400 font-mono text-xs">spixi-app-sdk.js</code>.
          </p>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Left Column: Package Structure -->
            <div class="bg-gray-900/80 p-6 rounded-2xl border border-gray-800">
              <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>📦 Package Structure</span>
              </h3>
              <pre class="bg-black/60 p-4 rounded-xl text-xs font-mono text-emerald-400 border border-gray-800 overflow-x-auto leading-relaxed mb-4">
app-directory/
├── appinfo.spixi     # Metadata manifest (id, name, version)
├── icon.png          # App icon (256x256 PNG)
└── app/
    ├── index.html    # Entrypoint HTML document
    └── js/
        └── spixi-app-sdk.js  # Host bridge script
              </pre>
              <h4 class="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">appinfo.spixi Manifest Format</h4>
              <pre class="bg-black/60 p-4 rounded-xl text-xs font-mono text-gray-300 border border-gray-800 overflow-x-auto leading-relaxed">
id=com.baracuda.spixi.my-app
name=My Mini App
version=1.0.0
description=Peer-to-peer utility application
publisher=Baracuda
category=Games
              </pre>
            </div>

            <!-- Right Column: SDK API & Event Handlers -->
            <div class="bg-gray-900/80 p-6 rounded-2xl border border-gray-800">
              <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>⚡ Key SDK Functions & Event Handlers</span>
              </h3>

              <div class="space-y-4 text-xs">
                <div class="border-b border-gray-800 pb-3">
                  <span class="text-blue-400 font-mono font-bold block mb-1">spixiSendAppData(dataHex)</span>
                  <p class="text-gray-400">Sends a hex-encoded data payload to the active chat peer over the encrypted P2P channel.</p>
                </div>

                <div class="border-b border-gray-800 pb-3">
                  <span class="text-emerald-400 font-mono font-bold block mb-1">window.onAppData = function(dataHex)</span>
                  <p class="text-gray-400">Callback triggered when incoming data payload is received from the remote peer.</p>
                </div>

                <div class="border-b border-gray-800 pb-3">
                  <span class="text-purple-400 font-mono font-bold block mb-1">window.onFriendStatus = function(status)</span>
                  <p class="text-gray-400">Monitors peer connectivity changes (online, offline, connected).</p>
                </div>

                <div>
                  <span class="text-amber-400 font-mono font-bold block mb-1">spixiGetSessionInfo()</span>
                  <p class="text-gray-400">Requests current user wallet address, session ID, and peer details from host.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 class="text-3xl md:text-4xl font-lexend text-white py-4 mt-10 text-center" id="faq">
            {{ t('pages.howitworks.faq.title') }}
        </h2>

        <div class="w-full flex justify-center mb-20">
            <div class="w-full md:w-9/12">
                <Faq
                    v-for = "i in 10"
                    :key = "i"
                    :id = "`faq${i}`"
                    :question = "t(`pages.howitworks.faq.q${i}`)"
                    :answer = "t(`pages.howitworks.faq.a${i}`) ? t(`pages.howitworks.faq.a${i}`) : undefined"
                />
            </div>
        </div>

        <SpixiSummary />

    </div>
</template>