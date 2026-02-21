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

    // GraphQL Optimization
    if (token) {
        try {
            // ⚡ Bolt Optimization: Two-step GraphQL strategy
            // 1. Fetch list of app folders first (lightweight)
            // 2. Batch fetch metadata for each app (efficient)

            // Step 1: List all app folders
            const listQuery = `
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

            const listResponse = await fetch('https://api.github.com/graphql', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: listQuery })
            })

            if (!listResponse.ok) {
                throw new Error(`GraphQL list request failed: ${listResponse.statusText}`)
            }

            const listData = await listResponse.json()
            if (listData.errors) {
                throw new Error(`GraphQL list errors: ${JSON.stringify(listData.errors)}`)
            }

            const entries = listData.data?.repository?.object?.entries

            if (!Array.isArray(entries)) {
                // If the path doesn't exist or isn't a tree, this might happen
                throw new Error('Invalid GraphQL response for app list')
            }

            // Filter for directories only (apps are folders)
            const appFolders = entries.filter((e: any) => e.type === 'tree')

            if (appFolders.length === 0) return []

            // Step 2: Batch fetch metadata (appinfo.spixi + icons)
            // We use aliases to fetch data for multiple apps in a single request
            const fragments = appFolders.map((app: any, index: number) => {
                return `
                    app${index}_info: object(expression: "${BRANCH}:${APPS_PATH}/${app.name}/appinfo.spixi") {
                        ... on Blob { text }
                    }
                    app${index}_icon_png: object(expression: "${BRANCH}:${APPS_PATH}/${app.name}/icon.png") {
                        __typename
                    }
                    app${index}_icon_svg: object(expression: "${BRANCH}:${APPS_PATH}/${app.name}/icon.svg") {
                        __typename
                    }
                `
            }).join('\n')

            const batchQuery = `
                query {
                    repository(owner: "${REPO_OWNER}", name: "${REPO_NAME}") {
                        ${fragments}
                    }
                }
            `

            const batchResponse = await fetch('https://api.github.com/graphql', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: batchQuery })
            })

            if (!batchResponse.ok) {
                throw new Error(`GraphQL batch request failed: ${batchResponse.statusText}`)
            }

            const batchData = await batchResponse.json()
            if (batchData.errors) {
                throw new Error(`GraphQL batch errors: ${JSON.stringify(batchData.errors)}`)
            }

            const repoData = batchData.data?.repository
            if (!repoData) {
                throw new Error('Invalid GraphQL response for batch data')
            }

            // Map results back to apps
            const apps = appFolders.map((app: any, index: number) => {
                const infoBlob = repoData[`app${index}_info`]
                const iconPng = repoData[`app${index}_icon_png`]
                const iconSvg = repoData[`app${index}_icon_svg`]

                // If appinfo.spixi is missing, skip this app
                if (!infoBlob || typeof infoBlob.text !== 'string') return null

                const info = parseAppInfo(infoBlob.text)
                const appId = app.name

                let iconUrl = null
                // Check for existence based on whether the object is null or not
                if (iconPng) {
                    iconUrl = `${RAW_BASE}/${appId}/icon.png`
                } else if (iconSvg) {
                    iconUrl = `${RAW_BASE}/${appId}/icon.svg`
                } else {
                    iconUrl = `${RAW_BASE}/${appId}/icon.svg` // Fallback
                }

                return {
                    id: info.id || appId,
                    name: info.name || appId,
                    description: info.description || "Spixi Mini App",
                    version: info.version || '1.0.0',
                    category: info.category,
                    icon: iconUrl,
                    downloadUrl: `${RAW_BASE}/${appId}/appinfo.spixi`,
                    sourceUrl: `${TREE_BASE}/${appId}`
                }
            }).filter((app: any) => app !== null)

            return apps

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
