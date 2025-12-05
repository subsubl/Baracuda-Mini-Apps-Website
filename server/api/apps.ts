export default defineEventHandler(async (event) => {
    const repoOwner = 'ixian-platform';
    const repoName = 'Spixi-Mini-Apps';
    const appsPath = 'apps';
    const branch = 'master';

    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${appsPath}?ref=${branch}`;

    try {
        const files: any[] = await $fetch(apiUrl);
        const appDirs = files.filter(file => file.type === 'dir');

        const apps = await Promise.all(appDirs.map(async (dir) => {
            const appId = dir.name;
            const rawBaseUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/${appsPath}/${appId}`;

            // Fetch appinfo.spixi
            const appInfoUrl = `${rawBaseUrl}/appinfo.spixi`;
            let appInfoText = '';
            try {
                appInfoText = await $fetch(appInfoUrl);
            } catch (e) {
                console.error(`Failed to fetch appinfo for ${appId}`, e);
                return null;
            }

            // Parse appinfo
            const appInfo: Record<string, string> = {};
            appInfoText.split('\n').forEach(line => {
                const [key, ...values] = line.split('=');
                if (key && values.length) {
                    appInfo[key.trim()] = values.join('=').trim();
                }
            });

            // Fetch README.md for description
            let description = 'No description available.';
            try {
                const readmeText: string = await $fetch(`${rawBaseUrl}/README.md`);
                // Simple extraction: find first non-empty line that isn't a header
                const lines = readmeText.split('\n').map(l => l.trim()).filter(l => l !== '' && !l.startsWith('#'));
                if (lines.length > 0) {
                    description = lines[0];
                }
            } catch (e) {
                // Description fetch failed, use default
            }

            return {
                name: appInfo.name || appId,
                version: appInfo.version || '0.0.0',
                description: description,
                icon: `${rawBaseUrl}/icon.png`,
                downloadUrl: appInfoUrl,
                sourceUrl: dir.html_url
            };
        }));

        return apps.filter(app => app !== null);

    } catch (e) {
        console.error('Failed to fetch apps list', e);
        return [];
    }
});
