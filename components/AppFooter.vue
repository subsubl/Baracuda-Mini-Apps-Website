<script setup>
const { t } = useI18n()
</script>

<template>
  <footer class="bg-[#0B0F19] border-t border-gray-800/80 pt-12 pb-10 text-gray-400 font-sans">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pb-8 border-b border-gray-800/60">
        <div>
          <NuxtLink to="/" class="inline-block mb-3">
            <BaseLogo />
          </NuxtLink>
          <p class="text-xs text-gray-400 max-w-md leading-relaxed">
            Unified catalog and interactive developer hub for peer-to-peer web mini apps on the Baracuda & Spixi ecosystem.
          </p>
        </div>

        <div class="flex items-center gap-4">
          <a
            href="https://github.com/subsubl/Spixi-mini-APPs"
            target="_blank"
            rel="noopener"
            class="px-3.5 py-2 bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-800 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <svg class="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
            <span>Baracuda GitHub</span>
          </a>

          <a
            href="https://github.com/ixian-platform/Spixi-Mini-Apps"
            target="_blank"
            rel="noopener"
            class="px-3.5 py-2 bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-800 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <svg class="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
            <span>Ixian Platform</span>
          </a>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-b border-gray-800/60 text-xs">
        <div>
          <h4 class="font-bold text-white uppercase tracking-wider mb-3">Platform</h4>
          <ul class="space-y-2">
            <li><NuxtLink to="/" class="hover:text-white transition-colors">Catalog Home</NuxtLink></li>
            <li><NuxtLink to="/builder" class="hover:text-white transition-colors">App Packer Tool</NuxtLink></li>
            <li><NuxtLink to="/howitworks" class="hover:text-white transition-colors">How It Works</NuxtLink></li>
            <li><NuxtLink to="/howitworks#docs" class="hover:text-white transition-colors">Developer Docs</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h4 class="font-bold text-white uppercase tracking-wider mb-3">Resources</h4>
          <ul class="space-y-2">
            <li><NuxtLink to="/howitworks#faq" class="hover:text-white transition-colors">FAQ & Troubleshooting</NuxtLink></li>
            <li><a href="https://github.com/subsubl/Spixi-mini-APPs" target="_blank" class="hover:text-white transition-colors">Community Apps Repo</a></li>
            <li><a href="https://github.com/ixian-platform/Spixi-Mini-Apps" target="_blank" class="hover:text-white transition-colors">Ixian Official Repo</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-bold text-white uppercase tracking-wider mb-3">Legal & Terms</h4>
          <ul class="space-y-2">
            <li><NuxtLink to="/privacy" class="hover:text-white transition-colors">Privacy Policy</NuxtLink></li>
            <li><NuxtLink to="/terms" class="hover:text-white transition-colors">Terms of Service</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h4 class="font-bold text-white uppercase tracking-wider mb-3">Ecosystem</h4>
          <ul class="space-y-2">
            <li><a href="https://www.ixian.io/" target="_blank" class="hover:text-white transition-colors">Ixian Network</a></li>
            <li><a href="https://baracuda.ent" target="_blank" class="hover:text-white transition-colors">Baracuda Project</a></li>
          </ul>
        </div>
      </div>

      <div class="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>© 2026 Baracuda. All rights reserved.</p>
        <p>Built for Spixi Messenger & Baracuda Decentralized Network.</p>
      </div>
    </div>
  </footer>
</template>