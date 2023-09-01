# useAsyncCache

## Demo

Cache async task result. Use input `params` as cache key. Good for those tasks that results do not change often.

::: demo:Demo

> Search for the same keyword again, and the cache will take effect (will not print a new *"get demo options"* log)

## Usage

```ts
import { useAsyncCache } from '@element-plus-pro/hooks'

function asyncTask(params: number) {
  // do something
}

const { task, clear } = useAsyncCache(asyncTask)

const result1 = await task(1) // cache result by key `1`

const result2 = await task(1) // `asyncTask` won't be executed, return cache result directly

const result3 = await task(3)
```