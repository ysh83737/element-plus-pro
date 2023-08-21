// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Keyword = any;
type RemoteMethod<T> = (keyword: Keyword) => Promise<T>;

/**
 * load and cache remote(request) data
 * @param remoteMethod the remote(request) method
 */
export function useRemoteCache<T>(remoteMethod: RemoteMethod<T>) {
  /** data cache map */
  let cache = new Map<Keyword, T>();

  async function doRemote(keyword: Keyword) {
    let result = cache.get(keyword) as T;
    if (!result) {
      result = remoteMethod(keyword) as T;
      cache.set(keyword, result);
    }
    if (result instanceof Promise) {
      result = await result;
      cache.set(keyword, result as never);
    }
    return result;
  }

  function clear() {
    cache.clear();
    cache = null as never;
  }
  return {
    /**
     * remote(request) method with cache 
     * @param keyword request params, usually query keyword
     */
    remoteMethod: doRemote,
    /** Clear cache and release closure variable(cache map) */
    clear,
  };
}
export default useRemoteCache;
