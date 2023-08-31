
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UseAsyncSerialTask<T> = (...args: any[]) => Promise<T> | T

type QueueTask = () => Promise<void>

export interface UseAsyncSerialReturn<T> {
  /**
   * serial task executor
   */
  task: UseAsyncSerialTask<T>
  /**
   * clear queue and closure variables
   */
  clear: () => void
}

/**
 * Turn asynchronous tasks into serial execution.
 *
 * @param task async task
 * @param interval interval between tasks
 */
export function useAsyncSerial<T>(
  task: UseAsyncSerialTask<T>,
  interval?: number,
): UseAsyncSerialReturn<T> {
  /** serial task queue */
  let queue: QueueTask[] = [];
  let loading = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function taskWrapper(...args: any[]): Promise<T> {
    const result = new Promise<T>((resolve) => {
      queue.push(() => {
        return Promise.resolve(task(...args))
          .then(resolve)
          .catch(error => resolve(Promise.reject(error)))
          .finally(() => {
            // release closure variables
            resolve = null as never;
            args = null as never;
          });
      });
    });

    invoke();

    return result;
  }

  /** invoke serial task in queue */
  async function invoke() {
    if (loading)
      return;

    // first-in first-out
    const curr = queue.shift();
    if (!curr)
      return;

    loading = true;
    await curr();
    loading = false;

    if (interval) {
      // delay invoke
      setTimeout(invoke, interval);
    }
    else {
      invoke();
    }
  }

  function clear() {
    queue.splice(0, queue.length);
    queue = null as never;
    loading = null as never;
  }

  return {
    task: taskWrapper,
    clear,
  };
}
