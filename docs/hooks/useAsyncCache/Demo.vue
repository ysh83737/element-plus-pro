<script lang="ts">
import { ElSelect, ElOption } from 'element-plus';
import 'element-plus/es/components/select/style/index';
import { onBeforeUnmount, ref, shallowRef } from 'vue';
import { useAsyncCache } from '@element-plus-pro/hooks';
import { getDemoOptions, Option } from './demoData';

export default {
  name: 'DemoUseAsyncCache',
};
</script>
<script lang="ts" setup>
const value = ref('');
const options = shallowRef<Option[]>([]);

const { task, clear } = useAsyncCache(getDemoOptions);

const loading = ref(false);
async function doRemote(keyword: string) {
  keyword = keyword.trim();
  if (!keyword) {
    options.value = [];
    return;
  }
  loading.value = true;
  options.value = await task(keyword);
  loading.value = false;
}

onBeforeUnmount(() => {
  clear();
});
</script>
<template>
  <div>
    <ElSelect
      v-model="value"
      filterable
      remote
      :remote-method="doRemote"
      :loading="loading"
    >
      <ElOption
        v-for="item in options"
        :key="item.value"
        :value="item.value"
        :label="item.label"
      />
    </ElSelect>
  </div>
</template>
