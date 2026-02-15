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
            // Step 1: Fetch list of app folders
            const listQuery = `
                query {
                    repository(owner: "${REPO_OWNER}", name: "${REPO_NAME}") {
                        object(expression: "${BRANCH}:${APPS_PATH}") {
                            ... on Tree {
                                entries {
                                    name
                                    object {
                                        __typename
                                    }
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
                console.warn('GraphQL list response entries is not an array (possibly invalid path)')
                throw new Error('Invalid GraphQL list response')
            }

            // Filter for directories (Tree)
            const appFolders = entries
                .filter((e: any) => e.object?.__typename === 'Tree')
                .map((e: any) => e.name)

            if (appFolders.length === 0) {
                return []
            }

            // Step 2: Batched fetch for app details using index-based aliases
            let queryParts: string[] = []

            appFolders.forEach((appId: string, index: number) => {
                const alias = `app_${index}`
                // Safe string interpolation: assuming appId doesn't contain double quotes, which is standard for git paths
                // Ideally we should escape quotes but folder names usually don't have them
                queryParts.push(`
                    ${alias}_info: object(expression: "${BRANCH}:${APPS_PATH}/${appId}/appinfo.spixi") {
                        ... on Blob {
                            text
                        }
                    }
                    ${alias}_icon_png: object(expression: "${BRANCH}:${APPS_PATH}/${appId}/icon.png") {
                        ... on Blob {
                            id
                        }
                    }
                    ${alias}_icon_svg: object(expression: "${BRANCH}:${APPS_PATH}/${appId}/icon.svg") {
                        ... on Blob {
                            id
                        }
                    }
                `)
            })

            const batchQuery = `
                query {
                    repository(owner: "${REPO_OWNER}", name: "${REPO_NAME}") {
                        ${queryParts.join('\n')}
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
                throw new Error('Invalid GraphQL batch response')
            }

            const apps = []

            for (let i = 0; i < appFolders.length; i++) {
                const appId = appFolders[i]
                const alias = `app_${i}`

                const infoBlob = repoData[`${alias}_info`]
                const iconPngBlob = repoData[`${alias}_icon_png`]
                const iconSvgBlob = repoData[`${alias}_icon_svg`]

                // Skip if no appinfo.spixi
                if (!infoBlob || typeof infoBlob.text !== 'string') {
                    continue
                }

                try {
                    const info = parseAppInfo(infoBlob.text)

                    let iconUrl = null
                    if (iconPngBlob) {
                        iconUrl = `${RAW_BASE}/${appId}/icon.png`
                    } else if (iconSvgBlob) {
                        iconUrl = `${RAW_BASE}/${appId}/icon.svg`
                    } else {
                        iconUrl = `${RAW_BASE}/${appId}/icon.svg` // Fallback
                    }

                    apps.push({
                        id: info.id || appId,
                        name: info.name || appId,
                        description: info.description || "Spixi Mini App",
                        version: info.version || '1.0.0',
                        category: info.category,
                        icon: iconUrl,
                        downloadUrl: `${RAW_BASE}/${appId}/appinfo.spixi`,
                        sourceUrl: `${TREE_BASE}/${appId}`
                    })
                } catch (e) {
                    console.warn(`Failed to parse info for ${appId}`, e)
                }
            }

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
