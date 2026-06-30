export default defineCachedEventHandler(async (event) => {
    const REPO_OWNER = 'ixian-platform'
    const REPO_NAME = 'Spixi-Mini-Apps'
    const BRANCH = 'master'
    const APPS_PATH = 'apps'
    const RAW_BASE = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/${APPS_PATH}`
    const TREE_BASE = `https://github.com/${REPO_OWNER}/${REPO_NAME}/tree/${BRANCH}/${APPS_PATH}`

    const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN

    // Helper to parse appinfo.spixi content
    const parseAppInfo = (infoText: string) => {
        const info: Record<string, string> = {}
        infoText.split('\n').forEach(line => {
            const [key, ...values] = line.split('=')
            if (key && values.length) {
                info[key.trim()] = values.join('=').trim()
            }
        })
        return info
    }

    // ⚡ Bolt Optimization: Use chunked batch aliases and byteSize to avoid downloading large binary payloads
    if (token) {
        try {
            // Step 1: Fetch list of directories (apps)
            const dirQuery = `
                query {
                    repository(owner: "${REPO_OWNER}", name: "${REPO_NAME}") {
                        object(expression: "${BRANCH}:${APPS_PATH}") {
                            ... on Tree {
                                entries {
                                    name
                                    type
                                }
                            }
                        }
                    }
                }
            `

            const dirResponse = await fetch('https://api.github.com/graphql', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: dirQuery })
            })

            if (!dirResponse.ok) throw new Error(`Directory fetch failed: ${dirResponse.statusText}`)
            const dirData = await dirResponse.json()
            if (dirData.errors) throw new Error(`GraphQL errors: ${JSON.stringify(dirData.errors)}`)

            const entries = dirData.data?.repository?.object?.entries
            if (!Array.isArray(entries)) throw new Error('Invalid directory response')

            const appDirs = entries.filter((e: any) => e.type === 'tree').map((e: any) => e.name)

            let allApps: any[] = []

            // Step 2: Fetch app details in chunks (avoiding query complexity limits)
            const chunkSize = 50
            for (let i = 0; i < appDirs.length; i += chunkSize) {
                const chunk = appDirs.slice(i, i + chunkSize)

                // Build aliased queries for this chunk
                let chunkQueryBody = ''
                chunk.forEach((appId, index) => {
                    chunkQueryBody += `
                        app${index}_info: object(expression: "${BRANCH}:${APPS_PATH}/${appId}/appinfo.spixi") {
                            ... on Blob { text }
                        }
                        app${index}_png: object(expression: "${BRANCH}:${APPS_PATH}/${appId}/icon.png") {
                            ... on Blob { byteSize }
                        }
                        app${index}_svg: object(expression: "${BRANCH}:${APPS_PATH}/${appId}/icon.svg") {
                            ... on Blob { byteSize }
                        }
                    `
                })

                const chunkQuery = `
                    query {
                        repository(owner: "${REPO_OWNER}", name: "${REPO_NAME}") {
                            ${chunkQueryBody}
                        }
                    }
                `

                const chunkResponse = await fetch('https://api.github.com/graphql', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ query: chunkQuery })
                })

                if (!chunkResponse.ok) throw new Error(`Chunk fetch failed: ${chunkResponse.statusText}`)
                const chunkData = await chunkResponse.json()
                if (chunkData.errors) throw new Error(`GraphQL errors in chunk: ${JSON.stringify(chunkData.errors)}`)

                const repoData = chunkData.data?.repository
                if (!repoData) throw new Error(`Missing repository data in chunk`)

                // Process chunk results
                chunk.forEach((appId, index) => {
                    const infoObj = repoData[`app${index}_info`]
                    const pngObj = repoData[`app${index}_png`]
                    const svgObj = repoData[`app${index}_svg`]

                    if (!infoObj || typeof infoObj.text !== 'string') return

                    const info = parseAppInfo(infoObj.text)

                    let iconUrl = null
                    if (pngObj && typeof pngObj.byteSize === 'number') {
                        iconUrl = `${RAW_BASE}/${appId}/icon.png`
                    } else if (svgObj && typeof svgObj.byteSize === 'number') {
                        iconUrl = `${RAW_BASE}/${appId}/icon.svg`
                    } else {
                        iconUrl = `${RAW_BASE}/${appId}/icon.svg` // Fallback
                    }

                    allApps.push({
                        id: info.id || appId,
                        name: info.name || appId,
                        description: info.description || "Spixi Mini App",
                        version: info.version || '1.0.0',
                        category: info.category,
                        icon: iconUrl,
                        downloadUrl: `${RAW_BASE}/${appId}/appinfo.spixi`,
                        sourceUrl: `${TREE_BASE}/${appId}`
                    })
                })
            }

            return allApps

        } catch (error) {
            console.warn('GraphQL fetch failed, falling back to REST API:', error)
            // Fallback proceeds below
        }
    }

    // Fallback: REST API (Tree + N fetches)
    try {
        const TREE_API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/${BRANCH}?recursive=1`

        // Fetch recursive tree
        const treeResponse = await fetch(TREE_API_URL)
        if (!treeResponse.ok) {
            throw new Error(`Failed to fetch repo tree: ${treeResponse.statusText}`)
        }
        const treeData = await treeResponse.json()

        if (treeData.truncated) {
             console.warn('GitHub tree response was truncated. Some apps might be missing.')
        }

        // Group files by app
        const appFiles: Record<string, Set<string>> = {}

        for (const item of treeData.tree) {
             // Only look at files under apps/
             if (!item.path.startsWith(APPS_PATH + '/')) continue

             // Extract app ID and file name
             const relativePath = item.path.substring(APPS_PATH.length + 1)
             const parts = relativePath.split('/')

             // We are looking for files directly inside the app folder: apps/{appId}/{filename}
             if (parts.length === 2) {
                 const appId = parts[0]
                 const fileName = parts[1]

                 if (!appFiles[appId]) {
                     appFiles[appId] = new Set()
                 }
                 appFiles[appId].add(fileName)
             }
        }

        const apps = await Promise.all(Object.keys(appFiles).map(async (appId) => {
            const files = appFiles[appId]

            // Check for icon
            let iconUrl = null
            if (files.has('icon.png')) {
                iconUrl = `${RAW_BASE}/${appId}/icon.png`
            } else if (files.has('icon.svg')) {
                iconUrl = `${RAW_BASE}/${appId}/icon.svg`
            }

            // Check for appinfo.spixi
            if (!files.has('appinfo.spixi')) {
                return null
            }

            try {
                // Fetch appinfo.spixi
                const appInfoUrl = `${RAW_BASE}/${appId}/appinfo.spixi`
                const infoResponse = await fetch(appInfoUrl)
                if (!infoResponse.ok) return null
                const infoText = await infoResponse.text()

                const info = parseAppInfo(infoText)

                return {
                    id: info.id || appId,
                    name: info.name || appId,
                    description: info.description || "Spixi Mini App",
                    version: info.version || '1.0.0',
                    category: info.category,
                    icon: iconUrl || `${RAW_BASE}/${appId}/icon.svg`, // Fallback
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
}, {
    maxAge: 3600,
    name: 'github-apps',
    getKey: () => 'apps-list'
})
