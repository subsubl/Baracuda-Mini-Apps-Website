/**
 * Concurrency limiter
 * @param concurrency Maximum number of concurrent tasks
 * @returns A runner function that queues tasks if concurrency limit is reached
 */
export default function (concurrency: number) {
  const queue: (() => void)[] = [];
  let activeCount = 0;

  const next = () => {
    activeCount--;
    if (queue.length > 0) {
      const resolve = queue.shift();
      if (resolve) resolve();
    }
  };

  const run = async <T>(fn: () => Promise<T>): Promise<T> => {
    if (activeCount >= concurrency) {
      await new Promise<void>((resolve) => queue.push(resolve));
    }

    activeCount++;

    try {
      return await fn();
    } finally {
      next();
    }
  };

  return run;
}
