import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import JSZip from 'jszip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const defaultAppsDir = path.resolve(__dirname, '../../Spixi-mini-APPs/apps');
const sourceArg = args[0] ? path.resolve(args[0]) : defaultAppsDir;

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
    if (!fs.existsSync(APPS_DIR)) {
        console.error(`Apps directory not found: ${APPS_DIR}`);
        process.exit(1);
    }

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

                const validationErrors = validateAppInfo(info);
                if (validationErrors.length > 0) {
                    console.warn(`Skipping ${folder}: ${validationErrors.join(', ')}`);
                    continue;
                }

                if (info.id && info.name) {
                    if (!fs.existsSync(destFolderPath)) {
                        fs.mkdirSync(destFolderPath, { recursive: true });
                    }

                    // Copy icon
                    const iconSrc = path.join(folderPath, 'icon.png');
                    if (fs.existsSync(iconSrc)) {
                        fs.copyFileSync(iconSrc, path.join(destFolderPath, 'icon.png'));
                        fs.copyFileSync(iconSrc, path.join(DEST_APPS_DIR, `${folder}.png`));
                    } else {
                        console.warn(`Icon not found for ${folder}`);
                    }

                    // Copy appinfo.spixi
                    fs.copyFileSync(appInfoPath, path.join(destFolderPath, 'appinfo.spixi'));
                    fs.copyFileSync(appInfoPath, path.join(DEST_APPS_DIR, `${folder}.spixi`));

                    // Copy app files to public folder
                    const appSubFolder = path.join(folderPath, 'app');
                    const targetAppSubFolder = path.join(destFolderPath, 'app');
                    
                    if (fs.existsSync(appSubFolder)) {
                        fs.cpSync(appSubFolder, targetAppSubFolder, { recursive: true });
                    } else {
                        // If root contains index.html, copy root
                        fs.cpSync(folderPath, destFolderPath, { recursive: true });
                    }

                    // Build zip archive
                    const zip = new JSZip();
                    const zipSource = fs.existsSync(appSubFolder) ? appSubFolder : folderPath;
                    await addDirectoryToZip(zip, zipSource, '');
                    const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
                    fs.writeFileSync(path.join(DEST_APPS_DIR, `${folder}.zip`), zipContent);

                    // Entrypoint URL for simulator
                    const hasAppFolder = fs.existsSync(appSubFolder);
                    const appUrl = `apps/${folder}/${hasAppFolder ? 'app/' : ''}index.html`;

                    apps.push({
                        id: info.id,
                        name: info.name,
                        version: info.version || '1.0.0',
                        description: info.description || `${info.name} mini app for Spixi and Baracuda platform.`,
                        publisher: info.publisher || 'Baracuda',
                        category: info.category || (folder.includes('game') || folder.includes('tictactoe') || folder.includes('doom') || folder.includes('pong') || folder.includes('coinflip') ? 'Games' : 'Tools'),
                        icon: `apps/${folder}/icon.png`,
                        appUrl: appUrl,
                        downloadUrl: `apps/${folder}.spixi`,
                        zipUrl: `apps/${folder}.zip`,
                        sourceUrl: `https://github.com/subsubl/Spixi-mini-APPs/tree/main/apps/${folder}`,
                        isNew: folder.includes('coinflip') || folder.includes('aiassistant') || folder.includes('starwind'),
                        isPopular: folder.includes('tictactoe') || folder.includes('doom') || folder.includes('whiteboard') || folder.includes('pong'),
                        installCount: Math.floor(Math.random() * 800) + 120
                    });
                }
            } catch (e) {
                console.warn(`Failed to parse ${appInfoPath}: ${e.message}`);
            }
        }
    }

    const outputContent = JSON.stringify(apps, null, 4);
    fs.writeFileSync(OUTPUT_FILE, outputContent);
    console.log(`✅ Generated ${OUTPUT_FILE} with ${apps.length} apps.`);
}

processApps().catch(err => {
    console.error(`Error processing apps:`, err);
    process.exit(1);
});
