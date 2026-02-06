export default function pLimit(concurrency: number) {
    const queue: (() => Promise<void>)[] = []
    let active = 0

    const next = () => {
        active--
        if (queue.length > 0) {
            const nextFn = queue.shift()
            if (nextFn) nextFn()
        }
    }

    return <T>(fn: () => Promise<T>): Promise<T> => new Promise((resolve, reject) => {
        const run = async () => {
            active++
            try {
                resolve(await fn())
            } catch (e) {
                reject(e)
            } finally {
                next()
            }
        }

        if (active < concurrency) {
            run()
        } else {
            queue.push(run)
        }
    })
}
