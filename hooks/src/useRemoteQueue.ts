
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RemoteMethod<P, R> = (params: P) => Promise<R>;
type QueueItem = () => Promise<void>;

/**
 * remote request queue,
 * suitable for interfaces that cannot request frequently (simultaneously)
 * @param remoteMethod the remote(request) method
 * @param interval the interval between requests
 */
export function useRemoteQueue<P, R>(remoteMethod: RemoteMethod<P, R>, interval?: number) {
  /** request queue */
  let queue: QueueItem[] = [];
  /** doing remote request */
  let loading = false;

  async function doRemote(params: P): Promise<R> {
    const result = new Promise<R>((resolve) => {
      queue.push(() => {
        return remoteMethod(params)
          .then(resolve)
          .catch((error) => resolve(Promise.reject(error)))
          .finally(() => {
            // release closure variables
            resolve = null as never;
            params = null as never;
          });
      });
    });

    execute();

    return result;
  }

  /** execute remote request task in queue */
  async function execute() {
    if (loading) return;

    // first-in first-out
    const cur = queue.shift();
    if (!cur) {
      return;
    }
    loading = true;
    await cur();
    loading = false;

    if (interval) {
      // delay execute
      setTimeout(execute, interval);
    } else {
      execute();
    }
  }

  function clear() {
    queue.splice(0, queue.length);
    queue = null as never;
    loading = null as never;
  }

  return {
    /**
     * remote(request) method with queue handler 
     * @param {any} params request params, usually query keyword
     */
    remoteMethod: doRemote,
    /** clear queue and closure variables */
    clear
  };
}
export default useRemoteQueue;
