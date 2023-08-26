<script lang="ts">
import { ElButton, ElScrollbar } from 'element-plus';
import 'element-plus/es/components/button/style/index';
import 'element-plus/es/components/scrollbar/style/index';
import { onBeforeUnmount, shallowRef } from 'vue';
import { useRemoteQueue } from '@element-plus-pro/hooks';
import { remoteRequest } from './demoData';

enum RESULT_TYPE {
  SUCCESS = 'success',
  FAIL = 'fail'
}
interface Result { counter: number, type: RESULT_TYPE, message: string}

export default {
  name: 'DemoUseRemoteQueue'
};
</script>
<script lang="ts" setup>
let counter = 0;

const normalResults = shallowRef<Result[]>([]);
async function onNormalLoad() {
  counter++;
  const result: Result = { counter, type: RESULT_TYPE.SUCCESS, message: '' };
  try {
    result.message = await remoteRequest(counter as never);
  } catch(error) {
    result.type = RESULT_TYPE.FAIL;
    result.message = error;
  }
  normalResults.value = [...normalResults.value, result];
}

const { remoteMethod, clear } = useRemoteQueue(remoteRequest);

const queueResults = shallowRef<Result[]>([]);
async function onQueueLoad() {
  counter++;
  const result: Result = { counter, type: RESULT_TYPE.SUCCESS, message: '' };
  try {
    result.message = await remoteMethod(counter);
  } catch(error) {
    result.type = RESULT_TYPE.FAIL;
    result.message = error;
  }
  queueResults.value = [...queueResults.value, result];
}
onBeforeUnmount(() => {
  clear();
});
</script>
<template>
  <div>
    <div
      class="mb-4"
    >
      <ElButton
        type="primary"
        plain
        @click="onNormalLoad"
      >
        快速连续点击：未使用useRemoteQueue
      </ElButton>
      <ElScrollbar
        class="mt-4 leading-6"
        :max-height="200"
      >
        <div
          v-for="(item, index) in normalResults"
          :key="index"
          :class="{
            'text-red-500': item.type === RESULT_TYPE.FAIL,
            'text-green-500': item.type === RESULT_TYPE.SUCCESS,
          }"
        >
          {{ item }}
        </div>
      </ElScrollbar>
    </div>
    <div
      class="mb-4"
      :max-height="200"
    >
      <ElButton
        type="primary"
        @click="onQueueLoad"
      >
        快速连续点击：使用useRemoteQueue
      </ElButton>
      <ElScrollbar
        class="mt-4 leading-6"
        :max-height="200"
      >
        <div
          v-for="(item, index) in queueResults"
          :key="index"
          :class="{
            'text-red-500': item.type === RESULT_TYPE.FAIL,
            'text-green-500': item.type === RESULT_TYPE.SUCCESS,
          }"
        >
          {{ item }}
        </div>
      </ElScrollbar>
    </div>
  </div>
</template>
