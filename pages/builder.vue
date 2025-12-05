<script setup lang="ts">
import JSZip from 'jszip';
import { ref } from 'vue';

const isDragging = ref(false);
const files = ref<File[]>([]);
const processing = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

const generatedZip = ref<{ url: string; name: string } | null>(null);
const generatedSpixi = ref<{ url: string; name: string } | null>(null);

const onDragOver = () => {
  isDragging.value = true;
};

const onDragLeave = () => {
  isDragging.value = false;
};

const onDrop = (e: DragEvent) => {
  isDragging.value = false;
  error.value = null;
  success.value = false;
  
  if (e.dataTransfer?.files) {
    const droppedFiles = Array.from(e.dataTransfer.files);
    files.value = droppedFiles;
    validateFiles();
  }
};

const onFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files) {
    files.value = Array.from(input.files);
    validateFiles();
  }
};

const validateFiles = () => {
    const hasAppInfo = files.value.some(f => f.name.toLowerCase() === 'appinfo.spixi');
    const hasIndex = files.value.some(f => f.name.toLowerCase() === 'index.html');
    
    if (!hasAppInfo) {
        error.value = "Missing 'appinfo.spixi'. Please include it.";
    } else if (!hasIndex) {
        error.value = "Missing 'index.html'. Please include it.";
    } else {
        error.value = null;
    }
};

const bytesToNice = (n: number) => {
    if (!Number.isFinite(n)) return '-';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    let v = Number(n);
    while (v >= 1024 && i < units.length - 1) {
        v /= 1024;
        i++;
    }
    return `${v.toFixed(v < 10 && i > 0 ? 2 : 0)} ${units[i]}`;
};

const parseAppInfo = (text: string) => {
    const lines = text.split(/\r?\n/);
    const info: Record<string, string> = {};
    for (const line of lines) {
        const match = line.match(/^\s*([^=]+?)\s*=\s*(.*?)\s*$/);
        if (match) {
            info[match[1]] = match[2];
        }
    }
    return info;
};

const computeSHA256 = async (blob: Blob) => {
    const buffer = await blob.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const packApp = async () => {
    if (processing.value) return;
    processing.value = true;
    error.value = null;
    success.value = false;

    try {
        const appInfoFile = files.value.find(f => f.name.toLowerCase() === 'appinfo.spixi');
        const indexFile = files.value.find(f => f.name.toLowerCase() === 'index.html');
        const iconFile = files.value.find(f => f.name.toLowerCase() === 'icon.png');

        if (!appInfoFile || !indexFile) {
            throw new Error("Missing required files (appinfo.spixi or index.html)");
        }

        // Read app info
        const appInfoText = await appInfoFile.text();
        const appInfo = parseAppInfo(appInfoText);
        
        const baseName = (appInfo.name || 'app').trim().replace(/\s+/g, '-').toLowerCase();
        const imageUrl = appInfo.image || `${baseName}.png`;
        const contentUrl = appInfo.contentUrl || `${baseName}.zip`;

        // Create Zip
        const zip = new JSZip();
        
        // Add files to zip
        // Structure:
        // - appinfo.spixi (root)
        // - icon.png (root)
        // - app/index.html 
        
        zip.file('appinfo.spixi', appInfoFile); // Keep appinfo in root for the zip? Wait, original pack-app.js logic:
        // pack-app.js: Line 125: if (!relativePath.startsWith('app/') && !relativePath.startsWith('appinfo.spixi') && !relativePath.startsWith('icon.png')) continue;
        // It zips specific relative paths.
        // Usually Spixi apps are distributed as:
        // The ZIP contains THE APP CONTENT (app folder). 
        // Wait, let's re-read pack-app.js.
        // Line 132: zip.file(relativePath, fileContent);
        // It adds 'app/index.html', 'appinfo.spixi', 'icon.png' TO THE ZIP under those paths.
        // So the zip has folders.
        
        zip.file('appinfo.spixi', appInfoFile);
        zip.folder('app')?.file('index.html', indexFile);
        
        if (iconFile) {
            zip.file('icon.png', iconFile);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
        const zipSize = zipBlob.size;
        const checksum = await computeSHA256(zipBlob);

        // Generate .spixi content
        const spixiContent = `caVersion = ${appInfo.caVersion || '0'}
id = ${appInfo.id || ''}
publisher = ${appInfo.publisher || ''}
name = ${appInfo.name || ''}
version = ${appInfo.version || ''}
capabilities = ${appInfo.capabilities || ''}
image = ${imageUrl}
minUsers = ${appInfo.minUsers || ''}
maxUsers = ${appInfo.maxUsers || ''}
protocols = ${appInfo.protocols || ''}
contentUrl = ${contentUrl}
checksum = ${checksum}
contentSize = ${zipSize}`;

        const spixiBlob = new Blob([spixiContent], { type: 'text/plain' });

        // Create download URLs
        if (generatedZip.value) URL.revokeObjectURL(generatedZip.value.url);
        if (generatedSpixi.value) URL.revokeObjectURL(generatedSpixi.value.url);

        generatedZip.value = {
            url: URL.createObjectURL(zipBlob),
            name: `${baseName}.zip`
        };

        generatedSpixi.value = {
            url: URL.createObjectURL(spixiBlob),
            name: `${baseName}.spixi`
        };

        success.value = true;

    } catch (e: any) {
        error.value = e.message;
    } finally {
        processing.value = false;
    }
};

</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Mini App Packer</h1>
        <p class="text-gray-600 dark:text-gray-400">
          Pack your Spixi Mini App directly in the browser. No installation required.
        </p>
      </div>

      <div
        class="border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-200 ease-in-out cursor-pointer"
        :class="[
          isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
            : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600',
          files.length > 0 ? 'bg-gray-50 dark:bg-gray-800' : ''
        ]"
        @dragover.prevent="onDragOver"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop"
        @click="$refs.fileInput.click()"
      >
        <input
          ref="fileInput"
          type="file"
          multiple
          class="hidden"
          @change="onFileSelect"
        />

        <div v-if="files.length === 0" class="space-y-4">
          <div class="flex justify-center">
            <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p class="text-lg font-medium text-gray-700 dark:text-gray-300">
              Drop files here or click to upload
            </p>
            <p class="text-sm text-gray-500 mt-2">
              Required: appinfo.spixi, index.html<br>
              Optional: icon.png
            </p>
          </div>
        </div>

        <div v-else class="space-y-4">
          <div class="flex flex-col items-center space-y-2">
            <div v-for="file in files" :key="file.name" class="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 px-3 py-1 rounded shadow-sm">
                <span v-if="['appinfo.spixi', 'index.html'].includes(file.name.toLowerCase())" class="text-green-500">
                    ✓
                </span>
                <span v-else-if="file.name.toLowerCase() === 'icon.png'" class="text-blue-500">
                    ℹ
                </span>
                <span v-else class="text-gray-400">?</span>
                <span>{{ file.name }}</span>
                <span class="text-xs text-gray-400">({{ bytesToNice(file.size) }})</span>
            </div>
          </div>
          <div v-if="error" class="text-red-500 text-sm font-medium mt-4">
            {{ error }}
          </div>
          <div v-else class="mt-4">
             <p class="text-green-500 font-medium">Ready to pack!</p>
          </div>
        </div>
      </div>

      <div class="mt-8 text-center" v-if="files.length > 0 && !error">
        <button
          @click.stop="packApp"
          :disabled="processing"
          class="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto space-x-2"
        >
          <span v-if="processing">Packing...</span>
          <span v-else>Pack Mini App</span>
        </button>
      </div>

      <div v-if="success && generatedZip && generatedSpixi" class="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
            <span class="text-green-500 mr-2">✓</span> Packing Complete
        </h2>
        
        <div class="grid gap-4 md:grid-cols-2">
            <a :href="generatedZip.url" :download="generatedZip.name" class="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
                <svg class="w-10 h-10 text-primary-500 mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span class="font-medium text-gray-900 dark:text-white">{{ generatedZip.name }}</span>
                <span class="text-xs text-gray-500 mt-1">Application Archive</span>
            </a>

            <a :href="generatedSpixi.url" :download="generatedSpixi.name" class="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
                <svg class="w-10 h-10 text-primary-500 mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="font-medium text-gray-900 dark:text-white">{{ generatedSpixi.name }}</span>
                <span class="text-xs text-gray-500 mt-1">Metadata File</span>
            </a>
        </div>

        <div class="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
            <p>Drag these files into your Spixi chat to share the app!</p>
        </div>
      </div>
    </div>
  </div>
</template>
