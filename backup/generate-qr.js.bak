const QRCode = require('qrcode-generator');
const fs = require('fs');

// Read apps.json
const apps = JSON.parse(fs.readFileSync('apps.json', 'utf8'));

// Create apps directory if it doesn't exist
if (!fs.existsSync('apps')) {
    fs.mkdirSync('apps');
}

// Generate QR codes for each app
apps.forEach(app => {
    const qr = QRCode(0, 'M');
    qr.addData(app.downloadUrl);
    qr.make();

    // Create SVG
    const svg = qr.createSvgTag(4, 0);
    const filename = `apps/${app.id}.svg`;

    fs.writeFileSync(filename, svg);
    console.log(`Generated QR code: ${filename}`);
    console.log(`  URL: ${app.downloadUrl}`);
});

console.log('\nAll QR codes generated successfully!');
