<script setup lang="ts">
import JSZip from 'jszip';
import { ref } from 'vue';

const isDragging = ref(false);
const filesMap = ref<Map<string, File>>(new Map());
const processing = ref(false);
const error = ref<string | null>(null);
const success = ref(false);

const generatedZSpixi = ref<{ url: string; name: string } | null>(null);
const generatedSpixi = ref<{ url: string; name: string } | null>(null);
const generatedIcon = ref<{ url: string; name: string } | null>(null);

const onDragOver = () => {
  isDragging.value = true;
};

const onDragLeave = () => {
  isDragging.value = false;
};

// Recursive file reading helper
const readEntry = async (entry: any, pathPrefix: string, rootFolder: string) => {
    if (entry.isFile) {
        await new Promise<void>((resolve) => {
            entry.file((file: File) => {
                const fullPath = pathPrefix + entry.name;
                // Remove the root folder name from the path if it exists
                // The rootFolder typically is "AppName/" so we want to strip that for the internal zip path
                const zipPath = fullPath.startsWith(rootFolder) 
                    ? fullPath.slice(rootFolder.length) 
                    : fullPath;
                
                // console.log("Found:", zipPath);
                filesMap.value.set(zipPath, file);
                resolve();
            });
        });
    } else if (entry.isDirectory) {
        const reader = entry.createReader();
        await new Promise<void>((resolve) => {
            const readEntries = async () => {
                reader.readEntries(async (entries: any[]) => {
                    if (entries.length === 0) {
                        resolve();
                        return;
                    }
                    for (const child of entries) {
                        await readEntry(child, pathPrefix + entry.name + '/', rootFolder);
                    }
                    // Recursively call readEntries because readEntries might not return all entries in one go
                    readEntries(); 
                });
            };
            readEntries();
        });
    }
};

const fileInput = ref<HTMLInputElement | null>(null);

const onClickUpload = () => {
  fileInput.value?.click();
};

const onFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    processInputFiles(input.files);
  }
  input.value = '';
};

const processInputFiles = (files: FileList) => {
    isDragging.value = false;
    error.value = null;
    success.value = false;
    filesMap.value.clear();
    processing.value = true;

    try {
        if (files.length === 0) return;

        // Determine root folder from the first file
        const firstPath = files[0].webkitRelativePath;
        let rootFolder = '';
        if (firstPath) {
             const parts = firstPath.split('/');
             if (parts.length > 1) {
                 rootFolder = parts[0] + '/';
             }
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const relativePath = file.webkitRelativePath || file.name;

            const zipPath = relativePath.startsWith(rootFolder)
              ? relativePath.slice(rootFolder.length)
              : relativePath;

            if (zipPath) {
                filesMap.value.set(zipPath, file);
            }
        }
        validateFiles();
    } catch (err) {
        console.error(err);
        error.value = "Error reading files. Please try again.";
    } finally {
        processing.value = false;
    }
};

const onDrop = async (e: DragEvent) => {
  isDragging.value = false;
  error.value = null;
  success.value = false;
  filesMap.value.clear();
  
  if (e.dataTransfer?.items) {
    const items = e.dataTransfer.items;
    processing.value = true;
    
    try {
        for (const item of items) {
            const entry = item.webkitGetAsEntry();
            if (entry) {
                // If it's a folder, we treat it as the root for our relative paths
                const rootFolder = entry.name + '/';
                await readEntry(entry, '', rootFolder);
            }
        }
        validateFiles();
    } catch (err) {
        console.error(err);
        error.value = "Error reading files. Please try again.";
    } finally {
        processing.value = false;
    }
  }
};

const validateFiles = () => {
    let hasAppInfo = false;
    let hasIndexHtml = false;

    for (const path of filesMap.value.keys()) {
        const p = path.toLowerCase();
        if (p === 'appinfo.spixi') hasAppInfo = true;
        if (p === 'app/index.html') hasIndexHtml = true;
    }

    if (!hasAppInfo) {
        error.value = "Missing 'appinfo.spixi'. Please include it in the root of your folder.";
    } else if (!hasIndexHtml) {
        error.value = "Missing 'app/index.html'. Please ensure your structure is correct.";
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
    if (processing.value || error.value) return;
    processing.value = true;
    error.value = null;
    success.value = false;

    try {
        const appInfoFile = Array.from(filesMap.value.entries()).find(
            ([path]) => path.toLowerCase() === 'appinfo.spixi'
        )?.[1];
        
        const iconFile = Array.from(filesMap.value.entries()).find(
            ([path]) => path.toLowerCase() === 'icon.png'
        )?.[1];

        if (!appInfoFile) {
            throw new Error("Missing required file: appinfo.spixi");
        }

        // Read app info
        const appInfoText = await appInfoFile.text();
        const appInfo = parseAppInfo(appInfoText);
        
        const baseName = (appInfo.name || 'app').trim().replace(/\s+/g, '-').toLowerCase();
        // According to new logic, image and contentUrl are forced derived from name if existing
        const imageUrl = `${baseName}.png`;
        const contentUrl = `${baseName}.zspixiapp`;

        // Create Zip
        const zip = new JSZip();
        
        // Add files to zip - Strict Filtering
        for (const [path, file] of filesMap.value.entries()) {
             if (!path.startsWith('app/') 
                 && !path.startsWith('appinfo.spixi') 
                 && !path.startsWith('icon.png')) {
                 continue;
             }
             zip.file(path, file);
        }

        const zipBlob = await zip.generateAsync({ 
            type: 'blob', 
            compression: 'DEFLATE',
            compressionOptions: { level: 6 } 
        });
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
        if (generatedZSpixi.value) URL.revokeObjectURL(generatedZSpixi.value.url);
        if (generatedSpixi.value) URL.revokeObjectURL(generatedSpixi.value.url);
        if (generatedIcon.value) URL.revokeObjectURL(generatedIcon.value.url);

        generatedZSpixi.value = {
            url: URL.createObjectURL(zipBlob),
            name: `${baseName}.zspixiapp`
        };

        generatedSpixi.value = {
            url: URL.createObjectURL(spixiBlob),
            name: `${baseName}.spixi`
        };

        if (iconFile) {
            generatedIcon.value = {
                url: URL.createObjectURL(iconFile),
                name: `${baseName}.png`
            };
        } else {
            generatedIcon.value = null;
        }

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
    <input
      type="file"
      ref="fileInput"
      class="hidden"
      webkitdirectory
      directory
      multiple
      @change="onFileSelect"
    />
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Mini App Packer</h1>
        <p class="text-gray-600 dark:text-gray-400">
          Pack specific Spixi Mini App folder directly in the browser.
        </p>
      </div>

      <div
        class="border-2 border-dashed rounded-lg p-12 text-center transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        :class="[
          isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
            : (error ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600'),
          filesMap.size > 0 && !error ? 'bg-gray-50 dark:bg-gray-800' : ''
        ]"
        role="button"
        tabindex="0"
        aria-label="Upload app folder"
        @dragover.prevent="onDragOver"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop"
        @click="onClickUpload"
        @keydown.enter.prevent="onClickUpload"
        @keydown.space.prevent="onClickUpload"
      >
        <div v-if="filesMap.size === 0" class="space-y-4">
          <div class="flex justify-center">
            <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <div>
            <p class="text-lg font-medium text-gray-700 dark:text-gray-300">
              Drop your app folder here or click to select
            </p>
            <p class="text-sm text-gray-500 mt-2">
              Must contain: appinfo.spixi, app/index.html
            </p>
          </div>
        </div>

        <div v-else class="space-y-4">
          <div class="flex flex-col items-center space-y-2">
            <div class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Loaded {{ filesMap.size }} files
            </div>
          </div>
          <div v-if="error" class="text-red-500 text-sm font-medium mt-4">
            {{ error }}
          </div>
          <div v-else class="mt-4">
             <p class="text-green-500 font-medium">Structure Valid. Ready to pack!</p>
          </div>
        </div>
      </div>

      <div class="mt-8 text-center" v-if="filesMap.size > 0 && !error">
        <button
          @click.stop="packApp"
          :disabled="processing"
          class="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto space-x-2"
        >
          <span v-if="processing">Packing...</span>
          <span v-else>Pack Mini App</span>
        </button>
      </div>

      <div v-if="success && generatedZSpixi && generatedSpixi" class="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
            <span class="text-green-500 mr-2">✓</span> Packing Complete
        </h2>
        
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <a :href="generatedZSpixi.url" :download="generatedZSpixi.name" class="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
                <svg class="w-10 h-10 text-primary-500 mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span class="font-medium text-gray-900 dark:text-white truncate max-w-full px-2" :title="generatedZSpixi.name">{{ generatedZSpixi.name }}</span>
                <span class="text-xs text-gray-500 mt-1">App Archive</span>
            </a>

            <a :href="generatedSpixi.url" :download="generatedSpixi.name" class="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group">
                <svg class="w-10 h-10 text-primary-500 mb-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span class="font-medium text-gray-900 dark:text-white truncate max-w-full px-2" :title="generatedSpixi.name">{{ generatedSpixi.name }}</span>
                <span class="text-xs text-gray-500 mt-1">Metadata File</span>
            </a>

            <div v-if="generatedIcon" class="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group relative">
                <a :href="generatedIcon.url" :download="generatedIcon.name" class="absolute inset-0 z-10 w-full h-full"></a>
                <img :src="generatedIcon.url" class="w-10 h-10 mb-3 object-contain group-hover:scale-110 transition-transform"/>
                <span class="font-medium text-gray-900 dark:text-white truncate max-w-full px-2" :title="generatedIcon.name">{{ generatedIcon.name }}</span>
                <span class="text-xs text-gray-500 mt-1">Icon</span>
            </div>
        </div>

        <div class="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
            <p>Upload these files to your web host to distribute your Mini App.</p>
        </div>
      </div>
    </div>
  </div>
</template>
