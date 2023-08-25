export type Option = { value: number; label: string; keyword: string };

export function getDemoOptions(keyword: string): Promise<Option[]> {
  console.log('模拟实际请求', keyword);
  const len = 10 + Math.round(Math.random() * 20); // 10~30
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = Array(len)
        .fill('')
        .map((_, index) => {
          const value = index + 1;
          return {
            value: value,
            label: `${keyword}-${value}`,
            keyword,
          };
        });
      resolve(result);
    }, 1000);
  });
}