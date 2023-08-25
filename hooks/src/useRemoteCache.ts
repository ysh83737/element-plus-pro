type RemoteMethod<P, R> = (keyword: P) => Promise<R>;

/**
 * load and cache remote(request) data
 * @param remoteMethod the remote(request) method
 */
export function useRemoteCache<P, R>(remoteMethod: RemoteMethod<P, R>) {
  /** data cache map */
  let cache = new Map<P, R>();

  async function doRemote(keyword: P) {
    let result = cache.get(keyword) as R;
    if (!result) {
      result = remoteMethod(keyword) as R;
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
