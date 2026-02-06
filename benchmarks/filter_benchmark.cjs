const { performance } = require('perf_hooks');

// Generate mock data
const numApps = 10000;
const apps = [];
const adjectives = ['Super', 'Mega', 'Fast', 'Secure', 'Private', 'Decentralized', 'Spixi', 'Ixian', 'Crypto', 'Chat'];
const nouns = ['Wallet', 'Messenger', 'Game', 'Tool', 'Editor', 'Viewer', 'Scanner', 'Builder', 'Packer', 'Graph'];

for (let i = 0; i < numApps; i++) {
  const name = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]} ${i}`;
  const description = `This is a ${adjectives[Math.floor(Math.random() * adjectives.length)].toLowerCase()} application for your ${nouns[Math.floor(Math.random() * nouns.length)].toLowerCase()}. It is very useful.`;
  apps.push({ name, description });
}

const searchQuery = "secure wallet";
const iterations = 500;

console.log(`Running benchmark with ${numApps} apps and ${iterations} iterations...`);

// Baseline
let baselineResultCount = 0;
const startBaseline = performance.now();
for (let i = 0; i < iterations; i++) {
  const q = searchQuery.toLowerCase();
  const result = apps.filter(app =>
    (app.name || '').toLowerCase().includes(q) ||
    (app.description || '').toLowerCase().includes(q)
  );
  baselineResultCount = result.length;
}
const endBaseline = performance.now();
const baselineTime = endBaseline - startBaseline;

console.log(`Baseline time: ${baselineTime.toFixed(2)}ms`);

// Optimized
const startOptimized = performance.now();

// 1. Pre-computation (Simulating the computed property that runs once when apps are loaded)
const searchableApps = apps.map(app => ({
    ...app,
    _searchName: (app.name || '').toLowerCase(),
    _searchDescription: (app.description || '').toLowerCase()
}));

const preComputationTime = performance.now() - startOptimized;
console.log(`Optimization overhead (one-time setup): ${preComputationTime.toFixed(2)}ms`);

// 2. Filtering (Simulating repeated searches)
let optimizedResultCount = 0;
const startOptimizedFilter = performance.now();
for (let i = 0; i < iterations; i++) {
    const q = searchQuery.toLowerCase();
    const result = searchableApps.filter(app =>
        app._searchName.includes(q) ||
        app._searchDescription.includes(q)
    );
    optimizedResultCount = result.length;
}
const endOptimized = performance.now();
const optimizedFilterTime = endOptimized - startOptimizedFilter;
const totalOptimizedTime = endOptimized - startOptimized;

console.log(`Optimized filter time (total for ${iterations} runs): ${optimizedFilterTime.toFixed(2)}ms`);
console.log(`Total optimized time (setup + runs): ${totalOptimizedTime.toFixed(2)}ms`);
console.log(`Improvement (Total): ${(baselineTime / totalOptimizedTime).toFixed(2)}x`);
console.log(`Improvement (Filter only): ${(baselineTime / optimizedFilterTime).toFixed(2)}x`);

if (baselineResultCount !== optimizedResultCount) {
    console.error(`Mismatch! Baseline found ${baselineResultCount}, Optimized found ${optimizedResultCount}`);
    process.exit(1);
} else {
    console.log(`SUCCESS: Results match (${baselineResultCount} found).`);
}
