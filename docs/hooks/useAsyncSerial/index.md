# useAsyncSerial

Turn asynchronous tasks into serial execution instead of parallel execution. Good for those tasks that cannot be performed frequently/simultaneously.

## Demo

::: demo:Demo

## Usage

```ts
import { useAsyncSerial } from '@vueuse/core'

function asyncTask() {
  // do something
}

const { task, clear } = useAsyncSerial(asyncTask)

// The following tasks will be executed in serially, not parallelly.
task()
task()
task()
```

### Practice

Here is an example of a practical application scenario.

A certain API is not allowed to be called at the same time. But it is unavoidable in the actual application that there will be calls at the same time/with a very short interval.

Using `useAsyncSerial` can avoid the API reporting errors and unexpected situations.

::: code-group
```ts [example-api.ts]
import { useAsyncSerial } from '@vueuse/core'

let loading = false
function asyncTask(): Promise<string> {
  if (loading)
    return Promise.reject(new Error('The service is busy'))

  loading = true
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('success')
      loading = false
    }, 1000)
  })
}

export const serialTask = useAsyncSerial(asyncTask).task
```

```ts [component1.vue]
import { onMounted } from 'vue'
import { serialTask } from './example-api'

onMounted(async () => {
  const data = await serialTask()
  console.log('component1:', data)
})
```

```ts [component2.vue]
import { onMounted } from 'vue'
import { serialTask } from './example-api'

onMounted(async () => {
  const data = await serialTask()
  console.log('component2:', data)
})
```
:::
