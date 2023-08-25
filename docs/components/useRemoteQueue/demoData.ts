let loading = false;

export function remoteRequest(params: number): Promise<string> {
  console.log('模拟实际请求', params);
  if (loading) {
    return Promise.reject('操作频繁，休息一下');
  }
  loading = true;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('success');
      loading = false;
    }, 1000);
  });
}