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
            // ⚡ Bolt Optimization: First list directories, then use batched alias queries to fetch only necessary file contents.
            // This prevents downloading massive binary payloads (like icon.png) as text in a deep recursive tree query.
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

            if (!dirResponse.ok) {
                throw new Error(`GraphQL dir request failed: ${dirResponse.statusText}`)
            }

            const dirData = await dirResponse.json()
            if (dirData.errors) {
                throw new Error(`GraphQL dir errors: ${JSON.stringify(dirData.errors)}`)
            }

            const dirEntries = dirData.data?.repository?.object?.entries

            if (!Array.isArray(dirEntries)) {
                console.warn('Unexpected GraphQL response structure, falling back to REST')
                throw new Error('Invalid GraphQL response')
            }

            const appIds = dirEntries.filter((e: any) => e.type === 'tree').map((e: any) => e.name)
            const apps: any[] = []

            // ⚡ Bolt Optimization: Chunk alias queries to avoid exceeding GitHub API complexity limits
            const chunkSize = 50
            for (let i = 0; i < appIds.length; i += chunkSize) {
                const chunk = appIds.slice(i, i + chunkSize)

                let aliases = chunk.map((appId, index) => {
                    const aliasPrefix = `app_${index}`
                    return `
                        ${aliasPrefix}_info: object(expression: "${BRANCH}:${APPS_PATH}/${appId}/appinfo.spixi") {
                            ... on Blob { text }
                        }
                        ${aliasPrefix}_png: object(expression: "${BRANCH}:${APPS_PATH}/${appId}/icon.png") {
                            ... on Blob { byteSize }
                        }
                        ${aliasPrefix}_svg: object(expression: "${BRANCH}:${APPS_PATH}/${appId}/icon.svg") {
                            ... on Blob { byteSize }
                        }
                    `
                }).join('\n')

                const batchQuery = `
                    query {
                        repository(owner: "${REPO_OWNER}", name: "${REPO_NAME}") {
                            ${aliases}
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
                if (!repoData) continue

                chunk.forEach((appId, index) => {
                    const aliasPrefix = `app_${index}`
                    const infoObj = repoData[`${aliasPrefix}_info`]
                    const pngObj = repoData[`${aliasPrefix}_png`]
                    const svgObj = repoData[`${aliasPrefix}_svg`]

                    if (!infoObj || typeof infoObj.text !== 'string') return

                    const info = parseAppInfo(infoObj.text)

                    // ⚡ Bolt Optimization: Query byteSize on Blob to check existence of binary files
                    // without downloading the large payload and chancing truncation
                    let iconUrl = null
                    if (pngObj && pngObj.byteSize > 0) {
                        iconUrl = `${RAW_BASE}/${appId}/icon.png`
                    } else if (svgObj && svgObj.byteSize > 0) {
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
                })
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
