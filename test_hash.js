const crypto = require('crypto');

const buffer = new ArrayBuffer(32);
const view = new Uint8Array(buffer);
crypto.randomFillSync(view); // Fill with random bytes

const start1 = performance.now();
for(let k=0; k<10000; k++) {
  const hashArray = Array.from(new Uint8Array(buffer));
  hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
console.log('Array.from:', performance.now() - start1);

const start2 = performance.now();
for(let k=0; k<10000; k++) {
    const uint8Array = new Uint8Array(buffer);
    let hexString = '';
    for (let i = 0; i < uint8Array.length; i++) {
        hexString += uint8Array[i].toString(16).padStart(2, '0');
    }
}
console.log('manual loop:', performance.now() - start2);
