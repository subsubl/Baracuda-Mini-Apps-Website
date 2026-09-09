<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
    <div class="glass-panel w-full max-w-5xl h-[85vh] rounded-2xl flex flex-col overflow-hidden border border-gray-700/60 shadow-2xl">
      
      <!-- Top Bar -->
      <div class="px-6 py-4 bg-gray-900/90 border-b border-gray-800 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img :src="app?.icon || '/img/default-icon.png'" :alt="app?.name" class="w-8 h-8 rounded-lg border border-gray-700 object-cover" />
          <div>
            <h3 class="font-bold text-white flex items-center gap-2 text-base">
              {{ app?.name || 'Mini App Simulator' }}
              <span class="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                v{{ app?.version || '1.0' }}
              </span>
            </h3>
            <p class="text-xs text-gray-400 font-mono">{{ app?.id || 'com.baracuda.spixi.app' }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button @click="resetSimulator" class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Restart
          </button>
          <button @click="close" class="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <!-- Main Container: Mobile Frame + Host Control Panel -->
      <div class="flex-1 flex flex-col lg:flex-row overflow-hidden bg-gray-950">
        
        <!-- Mobile Frame Viewport -->
        <div class="flex-1 flex items-center justify-center p-6 bg-gray-950/60 overflow-y-auto">
          <div class="w-[375px] h-[667px] bg-black rounded-[36px] border-[10px] border-gray-800 shadow-2xl flex flex-col relative overflow-hidden ring-1 ring-white/10">
            
            <!-- Mobile Status Header -->
            <div class="h-8 bg-gray-900 text-gray-400 px-6 text-[10px] flex items-center justify-between font-mono select-none border-b border-gray-800">
              <span>9:41</span>
              <span class="text-blue-400 font-semibold">Spixi P2P Webview</span>
              <span>100% 🔋</span>
            </div>

            <!-- Iframe Container -->
            <iframe
              ref="appIframe"
              :src="appUrl"
              class="w-full flex-1 bg-white border-0"
              @load="onIframeLoad"
            ></iframe>
          </div>
        </div>

        <!-- Right Side: Spixi Host Simulator Controls & Logs -->
        <div class="w-full lg:w-[420px] bg-gray-900/70 border-t lg:border-t-0 lg:border-l border-gray-800 flex flex-col overflow-hidden">
          
          <!-- Controls Tab -->
          <div class="p-4 border-b border-gray-800 bg-gray-900">
            <h4 class="text-sm font-bold text-gray-200 mb-3 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Spixi Host Controller
            </h4>

            <div class="space-y-3">
              <!-- Session Init -->
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-gray-400">Initialize Session (onInit)</label>
                <div class="flex gap-2">
                  <input v-model="simSessionId" type="text" placeholder="Session ID" class="flex-1 bg-gray-950 border border-gray-800 rounded px-2.5 py-1 text-xs text-white" />
                  <button @click="sendInit" class="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded transition-colors">
                    Init
                  </button>
                </div>
              </div>

              <!-- Peer Data Injection -->
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-gray-400">Simulate Peer Network Data (onNetworkData)</label>
                <div class="flex gap-2">
                  <input v-model="simPeerData" type="text" placeholder="Message data (JSON / string)" class="flex-1 bg-gray-950 border border-gray-800 rounded px-2.5 py-1 text-xs text-white" />
                  <button @click="sendPeerData" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white rounded transition-colors">
                    Send
                  </button>
                </div>
              </div>

              <!-- Payment Simulation -->
              <div class="space-y-1.5">
                <label class="text-xs font-medium text-gray-400">Simulate Incoming Payment (onTransactionReceived)</label>
                <div class="flex gap-2">
                  <input v-model="simPaymentAmount" type="number" placeholder="Amount IXI" class="w-28 bg-gray-950 border border-gray-800 rounded px-2.5 py-1 text-xs text-white" />
                  <button @click="sendTransaction" class="flex-1 bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white rounded transition-colors">
                    Trigger TX
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Logs Stream -->
          <div class="flex-1 flex flex-col p-4 min-h-0 bg-gray-950/80">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Host Event Log</span>
              <button @click="clearLogs" class="text-[11px] text-gray-500 hover:text-gray-300">Clear</button>
            </div>

            <div class="flex-1 overflow-y-auto font-mono text-[11px] space-y-1.5 p-2 bg-black/60 rounded border border-gray-800/80">
              <div v-if="logs.length === 0" class="text-gray-600 italic py-4 text-center">
                No SDK events recorded yet. Interact with the app or send controls above.
              </div>
              <div v-for="(log, idx) in logs" :key="idx" class="leading-relaxed border-b border-gray-900 pb-1">
                <span class="text-gray-500">[{{ log.time }}]</span>
                <span :class="log.typeClass" class="font-bold ml-1">[{{ log.type }}]</span>
                <span class="text-gray-300 ml-1.5 break-all">{{ log.msg }}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  app: Object,
});

const emit = defineEmits(['close']);

const appIframe = ref(null);
const appUrl = ref('');
const logs = ref([]);
const simSessionId = ref('sess_987654321');
const simPeerData = ref('{"action":"ping","time":123456}');
const simPaymentAmount = ref(10);
const memoryStorage = ref({});

watch(() => props.app, (newApp) => {
  if (newApp) {
    appUrl.value = newApp.appUrl || `apps/${newApp.id}/app/index.html`;
    resetSimulator();
  }
}, { immediate: true });

function close() {
  emit('close');
}

function addLog(type, msg, color = 'text-blue-400') {
  const time = new Date().toLocaleTimeString();
  logs.value.push({ time, type, msg, typeClass: color });
}

function clearLogs() {
  logs.value = [];
}

function resetSimulator() {
  clearLogs();
  addLog('SYSTEM', `Booting simulator for ${props.app?.name || 'Mini App'}...`, 'text-yellow-400');
  if (appIframe.value) {
    appIframe.value.src = appUrl.value;
  }
}

function onIframeLoad() {
  addLog('IFRAME', 'Webview loaded app index.html successfully.', 'text-emerald-400');
  // Automatically trigger init on load
  setTimeout(() => {
    sendInit();
  }, 500);
}

function sendInit() {
  if (!appIframe.value || !appIframe.value.contentWindow) return;
  const userAddr = '0xBARACUDA_USER_ADDRESS_11111';
  const remoteAddr = '0xBARACUDA_PEER_ADDRESS_22222';
  
  appIframe.value.contentWindow.postMessage({
    type: 'spixi-sim-init',
    sessionId: simSessionId.value,
    userAddress: userAddr,
    remoteAddresses: [remoteAddr]
  }, '*');

  addLog('HOST->APP', `Sent onInit(sessionId: ${simSessionId.value}, user: ${userAddr})`, 'text-emerald-400');
}

function sendPeerData() {
  if (!appIframe.value || !appIframe.value.contentWindow) return;
  const remoteAddr = '0xBARACUDA_PEER_ADDRESS_22222';
  
  appIframe.value.contentWindow.postMessage({
    type: 'spixi-sim-network-data',
    senderAddress: remoteAddr,
    data: simPeerData.value
  }, '*');

  addLog('HOST->APP', `Sent onNetworkData from ${remoteAddr}: ${simPeerData.value}`, 'text-emerald-400');
}

function sendTransaction() {
  if (!appIframe.value || !appIframe.value.contentWindow) return;
  const remoteAddr = '0xBARACUDA_PEER_ADDRESS_22222';
  
  appIframe.value.contentWindow.postMessage({
    type: 'spixi-sim-transaction',
    senderAddress: remoteAddr,
    amount: simPaymentAmount.value,
    txid: '0xTX_' + Math.random().toString(36).substr(2, 9),
    data: 'Simulated payment',
    verified: true
  }, '*');

  addLog('HOST->APP', `Sent onTransactionReceived (${simPaymentAmount.value} IXI)`, 'text-purple-400');
}

function handlePostMessage(event) {
  if (!event.data || typeof event.data !== 'object') return;
  const data = event.data;

  if (data.type === 'spixi-onload') {
    addLog('APP->HOST', `App registered fireOnLoad (SDK v${data.version})`, 'text-blue-400');
  } else if (data.type === 'spixi-back') {
    addLog('APP->HOST', `App triggered back() navigation`, 'text-yellow-400');
  } else if (data.type === 'spixi-action') {
    const act = data.action || {};
    addLog('APP->HOST', `Action [${act.c || 'unknown'}]: ${JSON.stringify(act)}`, 'text-cyan-400');

    // Handle Storage & Action Responses
    if (act.c === 'getStorage') {
      const key = `${act.t}_${act.k}`;
      const val = memoryStorage.value[key] || 'null';
      if (appIframe.value && appIframe.value.contentWindow) {
        appIframe.value.contentWindow.postMessage({
          type: 'spixi-sim-action-response',
          response: { id: act.id, r: val }
        }, '*');
      }
    } else if (act.c === 'setStorage') {
      const key = `${act.t}_${act.k}`;
      memoryStorage.value[key] = act.v;
      if (appIframe.value && appIframe.value.contentWindow) {
        appIframe.value.contentWindow.postMessage({
          type: 'spixi-sim-action-response',
          response: { id: act.id, r: 'true' }
        }, '*');
      }
    } else if (act.c === 'sendPayment') {
      addLog('SIMULATOR', `Mock payment processed for ${JSON.stringify(act.recipients)}`, 'text-purple-400');
      if (appIframe.value && appIframe.value.contentWindow) {
        appIframe.value.contentWindow.postMessage({
          type: 'spixi-sim-action-response',
          response: { id: act.id, r: JSON.stringify({ status: 'ok', txid: '0xTX_SIM_' + Date.now() }) }
        }, '*');
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('message', handlePostMessage);
});

onUnmounted(() => {
  window.removeEventListener('message', handlePostMessage);
});
</script>
