<script lang="ts">
import { ElButton } from 'element-plus';
import 'element-plus/es/components/button/style/index';
import { onBeforeUnmount, shallowRef, ref } from 'vue';
import { useAsyncSerial } from '@element-plus-pro/hooks';
import type { UseAsyncSerialTask } from '@element-plus-pro/hooks';

enum RESULT_TYPE {
  SUCCESS = 'success',
  FAIL = 'fail',
}
interface Result { count: number; type: RESULT_TYPE; message: string}

let loading = false;
function asyncTask(): Promise<string> {
  if (loading)
    return Promise.reject(new Error('The service is busy'));

  loading = true;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('success');
      loading = false;
    }, 1000);
  });
}
export default {
  name: 'UseAsyncSerialDemo',
};
</script>

<script lang="ts" setup>
function useLoad(task: UseAsyncSerialTask<string>) {
  const count = ref(0);
  function inc() {
    count.value++;
  }

  const results = shallowRef<Result[]>([]);

  async function doTask() {
    inc();
    const result: Result = { count: count.value, type: RESULT_TYPE.SUCCESS, message: '' };
    try {
      result.message = await task();
    }
    catch (error) {
      result.type = RESULT_TYPE.FAIL;
      result.message = (error as Error).message;
    }
    results.value = [...results.value, result];
  }
  return { count, results, doTask };
}

const notUsing = (() => {
  return useLoad(asyncTask);
})();

const using = (() => {
  const { task, clear } = useAsyncSerial(asyncTask);
  return { ...useLoad(task), clear };
})();

onBeforeUnmount(() => {
  using.clear();
});
</script>

<template>
  <div>
    <div>
      <div>Not using useAsyncSerial</div>
      <ElButton @click="notUsing.doTask">
        <div>
          Quick clicks me
        </div>
        <div>(count: {{ notUsing.count }})</div>
      </ElButton>
      <div class="mt-4 leading-6">
        <div
          v-for="(item, index) in notUsing.results.value"
          :key="index"
          :class="{
            'text-red-500': item.type === RESULT_TYPE.FAIL,
            'text-green-500': item.type === RESULT_TYPE.SUCCESS,
          }"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <div class="mt-6">
      <div>Using useAsyncSerial</div>
      <ElButton @click="using.doTask">
        <div>
          Quick clicks me
        </div>
        <div>(count: {{ using.count }})</div>
      </ElButton>
      <div class="mt-4 leading-6">
        <div
          v-for="(item, index) in using.results.value"
          :key="index"
          :class="{
            'text-red-500': item.type === RESULT_TYPE.FAIL,
            'text-green-500': item.type === RESULT_TYPE.SUCCESS,
          }"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>
