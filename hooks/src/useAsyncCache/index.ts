export type UseAsyncCacheTask<P, R> = (params: P) => Promise<R>;

export interface UseAsyncCacheReturn<P, R> {
  /**
   * async task executor
   */
  task: UseAsyncCacheTask<P, R>
  /**
   * clear caches and closure variables
   */
  clear: () => void
}

type CacheKey = string | number;

/**
 * execute async task and cache the result
 *
 * @template P
 * @template R
 * @param {UseAsyncCacheTask<P, R>} task
 * @returns {UseAsyncCacheReturn<P, R>}
 */
export function useAsyncCache<P, R>(
  task: UseAsyncCacheTask<P, R>
): UseAsyncCacheReturn<P, R> {
  /** results cache map */
  let cache = new Map<CacheKey, R | Promise<R>>();

  async function taskWrapper(params: P): Promise<R> {
    let key: CacheKey = params as never;
    if (params instanceof Object) {
      key = JSON.stringify(params);
    }
    let result = cache.get(key);
    if (!result) {
      result = task(params);
      cache.set(key, result);
    }
    if (result instanceof Promise) {
      result = await result;
      cache.set(key, result);
    }
    return result;
  }

  function clear() {
    cache.clear();
    cache = null as never;
  }
  return {
    task: taskWrapper,
    clear
  };
}
