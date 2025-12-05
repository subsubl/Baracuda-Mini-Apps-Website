export default defineEventHandler(async (event) => {
    const REPO_OWNER = 'ixian-platform'
    const REPO_NAME = 'Spixi-Mini-Apps'
    const BRANCH = 'master'
    const APPS_PATH = 'apps'
    const GITHUB_API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${APPS_PATH}`
    const RAW_BASE = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/refs/heads/${BRANCH}/${APPS_PATH}`
    const TREE_BASE = `https://github.com/${REPO_OWNER}/${REPO_NAME}/tree/${BRANCH}/${APPS_PATH}`

    try {
        // Fetch list of apps (directories)
        const appsListResponse = await fetch(GITHUB_API_BASE)
        if (!appsListResponse.ok) {
            throw new Error(`Failed to fetch apps list: ${appsListResponse.statusText}`)
        }
        const appsList = await appsListResponse.json()

        const apps = await Promise.all(appsList.filter((item: any) => item.type === 'dir').map(async (appDir: any) => {
            const appId = appDir.name
            const appInfoUrl = `${RAW_BASE}/${appId}/appinfo.spixi`

            try {
                // Fetch appinfo.spixi
                const infoResponse = await fetch(appInfoUrl)
                if (!infoResponse.ok) return null
                const infoText = await infoResponse.text()

                // Parse appinfo.spixi
                const info: Record<string, string> = {}
                infoText.split('\n').forEach(line => {
                    const [key, ...values] = line.split('=')
                    if (key && values.length) {
                        info[key.trim()] = values.join('=').trim()
                    }
                })

                return {
                    id: info.id || appId,
                    name: info.name || appId,
                    description: info.description || "Spixi Mini App", // Fallback as description isn't standard in all appinfo files
                    version: info.version || '1.0.0',
                    icon: `${RAW_BASE}/${appId}/icon.svg`, // Assuming svg, fallback strategy could be added
                    downloadUrl: appInfoUrl,
                    sourceUrl: `${TREE_BASE}/${appId}`
                }
            } catch (e) {
                console.error(`Error processing app ${appId}:`, e)
                return null
            }
        }))

        return apps.filter(app => app !== null)

    } catch (error) {
        console.error('Error fetching apps from GitHub:', error)
        return []
    }
})
