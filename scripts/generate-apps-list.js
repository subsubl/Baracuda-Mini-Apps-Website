import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import JSZip from 'jszip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const subsublAppsDir = path.resolve(__dirname, '../../Spixi-mini-APPs/apps');
const ixianAppsDir = path.resolve(__dirname, '../../Spixi-Mini-Apps/apps');

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

function validateAppInfo(info) {
    const errors = [];
    if (!info.id) {
        errors.push("Missing 'id'");
    } else if (!/^[a-zA-Z0-9.-]+$/.test(info.id)) {
        errors.push(`Invalid 'id' format: "${info.id}"`);
    }
    if (!info.name || !info.name.trim()) {
        errors.push("Missing or empty 'name'");
    }
    if (info.version && !/^\d+\.\d+\.\d+$/.test(info.version)) {
        errors.push(`Invalid 'version' format: "${info.version}"`);
    }
    return errors;
}

async function addDirectoryToZip(zip, dirPath, zipFolder) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stat = fs.statSync(fullPath);
        const targetPath = zipFolder ? `${zipFolder}/${file}` : file;
        if (stat.isDirectory()) {
            await addDirectoryToZip(zip, fullPath, targetPath);
        } else {
            const data = fs.readFileSync(fullPath);
            zip.file(targetPath, data);
        }
    }
}

async function processApps() {
    if (!fs.existsSync(DEST_APPS_DIR)) {
        fs.mkdirSync(DEST_APPS_DIR, { recursive: true });
    }

    const sources = [
        {
            name: 'Baracuda / Community (subsubl)',
            dir: subsublAppsDir,
            repoUrl: 'https://github.com/subsubl/Spixi-mini-APPs',
            branch: 'main'
        },
        {
            name: 'Ixian Official (ixian-platform)',
            dir: ixianAppsDir,
            repoUrl: 'https://github.com/ixian-platform/Spixi-Mini-Apps',
            branch: 'master'
        }
    ];

    const appsMap = new Map();

    for (const source of sources) {
        if (!fs.existsSync(source.dir)) {
            console.warn(`Source directory not found: ${source.dir}`);
            continue;
        }

        const folders = fs.readdirSync(source.dir);
        console.log(`Scanning ${folders.length} folders from ${source.name}...`);

        for (const folder of folders) {
            const folderPath = path.join(source.dir, folder);
            const appInfoPath = path.join(folderPath, 'appinfo.spixi');
            const destFolderPath = path.join(DEST_APPS_DIR, folder);

            if (fs.statSync(folderPath).isDirectory() && fs.existsSync(appInfoPath)) {
                try {
                    const content = fs.readFileSync(appInfoPath, 'utf8');
                    const info = parseAppInfo(content);

                    const validationErrors = validateAppInfo(info);
                    if (validationErrors.length > 0) {
                        console.warn(`Skipping ${folder}: ${validationErrors.join(', ')}`);
                        continue;
                    }

                    if (!info.id || !info.name) continue;

                    // Deduplication check: if app ID already added, skip duplicate
                    if (appsMap.has(info.id)) {
                        console.log(`[Deduplicated] Skipping duplicate app ID '${info.id}' from ${source.name}`);
                        continue;
                    }

                    if (!fs.existsSync(destFolderPath)) {
                        fs.mkdirSync(destFolderPath, { recursive: true });
                    }

                    // Copy icon
                    const iconSrc = path.join(folderPath, 'icon.png');
                    if (fs.existsSync(iconSrc)) {
                        fs.copyFileSync(iconSrc, path.join(destFolderPath, 'icon.png'));
                        fs.copyFileSync(iconSrc, path.join(DEST_APPS_DIR, `${folder}.png`));
                    }

                    // Copy appinfo.spixi
                    fs.copyFileSync(appInfoPath, path.join(destFolderPath, 'appinfo.spixi'));
                    fs.copyFileSync(appInfoPath, path.join(DEST_APPS_DIR, `${folder}.spixi`));

                    // Copy app files
                    const appSubFolder = path.join(folderPath, 'app');
                    const targetAppSubFolder = path.join(destFolderPath, 'app');

                    if (fs.existsSync(appSubFolder)) {
                        fs.cpSync(appSubFolder, targetAppSubFolder, { recursive: true });
                    } else {
                        fs.cpSync(folderPath, destFolderPath, { recursive: true });
                    }

                    // Build zip archive
                    const zip = new JSZip();
                    const zipSource = fs.existsSync(appSubFolder) ? appSubFolder : folderPath;
                    await addDirectoryToZip(zip, zipSource, '');
                    const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
                    fs.writeFileSync(path.join(DEST_APPS_DIR, `${folder}.zip`), zipContent);

                    // Entrypoint URL
                    const hasAppFolder = fs.existsSync(appSubFolder);
                    const appUrl = `apps/${folder}/${hasAppFolder ? 'app/' : ''}index.html`;

                    // Determine category
                    let category = info.category;
                    if (!category) {
                        const lowerFolder = folder.toLowerCase();
                        if (lowerFolder.includes('game') || lowerFolder.includes('tictactoe') || lowerFolder.includes('doom') || lowerFolder.includes('pong') || lowerFolder.includes('coinflip') || lowerFolder.includes('protocol') || lowerFolder.includes('dentist') || lowerFolder.includes('starwind')) {
                            category = 'Games';
                        } else if (lowerFolder.includes('ai') || lowerFolder.includes('kalker') || lowerFolder.includes('manual')) {
                            category = 'Tools';
                        } else {
                            category = 'Utilities';
                        }
                    }

                    const appObject = {
                        id: info.id,
                        name: info.name,
                        version: info.version || '1.0.0',
                        description: info.description || `${info.name} mini app for Spixi & Baracuda ecosystem.`,
                        publisher: info.publisher || (source.repoUrl.includes('subsubl') ? 'Baracuda Community' : 'Ixian Platform'),
                        repoSource: source.name,
                        category: category,
                        icon: `apps/${folder}/icon.png`,
                        appUrl: appUrl,
                        downloadUrl: `apps/${folder}.spixi`,
                        zipUrl: `apps/${folder}.zip`,
                        sourceUrl: `${source.repoUrl}/tree/${source.branch}/apps/${folder}`,
                        isNew: folder.includes('protocol') || folder.includes('coinflip') || folder.includes('dentist'),
                        isPopular: folder.includes('protocol') || folder.includes('doom') || folder.includes('tictactoe') || folder.includes('pong') || folder.includes('starwind'),
                        installCount: 0 // placeholder; real install metrics are not available yet
                    };

                    appsMap.set(info.id, appObject);
                } catch (e) {
                    console.warn(`Failed to parse ${appInfoPath}: ${e.message}`);
                }
            }
        }
    }

    const appsList = Array.from(appsMap.values());
    const outputContent = JSON.stringify(appsList, null, 4);
    fs.writeFileSync(OUTPUT_FILE, outputContent);
    console.log(`✅ Generated ${OUTPUT_FILE} with ${appsList.length} unique apps from both sources.`);
}

processApps().catch(err => {
    console.error(`Error processing apps:`, err);
    process.exit(1);
});
