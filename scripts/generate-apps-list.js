import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Allow overriding APPS_DIR via command line argument
const args = process.argv.slice(2);
const sourceArg = args[0] ? path.resolve(args[0]) : path.join(__dirname, '../Spixi-mini-APPs/apps');

const APPS_DIR = sourceArg;
const DEST_APPS_DIR = path.join(__dirname, '../public/apps');
const OUTPUT_FILE = path.join(__dirname, '../public/apps.json');

function parseAppInfo(text) {
    const lines = text.split(/\r?\n/);
    const info = {};
    for (const line of lines) {
        const match = line.match(/^\s*([^=]+?)\s*=\s*(.*?)\s*$/);
        if (match) {
            info[match[1]] = match[2];
        }
    }
    return info;
}

if (!fs.existsSync(APPS_DIR)) {
    console.error(`Apps directory not found: ${APPS_DIR}`);
    process.exit(1);
}

// Ensure destination directory exists
if (!fs.existsSync(DEST_APPS_DIR)) {
    fs.mkdirSync(DEST_APPS_DIR, { recursive: true });
}

const apps = [];
const folders = fs.readdirSync(APPS_DIR);

console.log(`Scanning ${folders.length} folders from ${APPS_DIR}...`);

for (const folder of folders) {
    const folderPath = path.join(APPS_DIR, folder);
    const appInfoPath = path.join(folderPath, 'appinfo.spixi');
    const destFolderPath = path.join(DEST_APPS_DIR, folder);

    if (fs.statSync(folderPath).isDirectory() && fs.existsSync(appInfoPath)) {
        try {
            const content = fs.readFileSync(appInfoPath, 'utf8');
            const info = parseAppInfo(content);

            // Add some basic validation or enrichment if needed
            if (info.id && info.name) {
                // Ensure destination folder exists
                if (!fs.existsSync(destFolderPath)) {
                    fs.mkdirSync(destFolderPath, { recursive: true });
                }

                // Copy icon if it exists
                const iconSrc = path.join(folderPath, 'icon.png');
                if (fs.existsSync(iconSrc)) {
                    fs.copyFileSync(iconSrc, path.join(destFolderPath, 'icon.png'));
                } else {
                    console.warn(`Icon not found for ${folder}`);
                }

                // Copy appinfo.spixi
                fs.copyFileSync(appInfoPath, path.join(destFolderPath, 'appinfo.spixi'));

                apps.push({
                    id: info.id,
                    name: info.name,
                    version: info.version || '0.0.0',
                    description: info.description || '',
                    publisher: info.publisher || 'Unknown',
                    category: info.category || 'Utility',
                    icon: `apps/${folder}/icon.png`,
                    downloadUrl: `apps/${folder}/appinfo.spixi`,
                    sourceUrl: `https://github.com/ixian-platform/Spixi-Mini-Apps/tree/master/apps/${folder}`
                });
            }
        } catch (e) {
            console.warn(`Failed to parse ${appInfoPath}: ${e.message}`);
        }
    }
}

const outputContent = JSON.stringify(apps, null, 4);
fs.writeFileSync(OUTPUT_FILE, outputContent);

console.log(`Generated ${OUTPUT_FILE} with ${apps.length} apps.`);
