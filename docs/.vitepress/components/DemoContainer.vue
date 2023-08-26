<script lang="ts">
import { onErrorCaptured, ref } from 'vue'

export default {
  name: 'DemoContainer',
};
</script>
<script setup lang="ts">
defineProps<{
  /** link to demo source code */
  source?: string
}>();

const error = ref<Error | null>(null)

onErrorCaptured((err) => {
  error.value = err
})
</script>

<template>
  <div class="demo-container">
    <slot name="source">
      <a v-if="source" :href="source" target="_blank" class="demo-container__source">source</a>
    </slot>
    <slot />
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
.demo-container {
  position: relative;
  padding: 2em;
  margin-bottom: 10px;
  font-size: 14px;
  background: #7d7d7d0a;
  border-radius: 8px;
  transition: background-color 0.5s;
}

.demo-container__source {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 12px;
  font-weight: 500;
  color: #666;
  transition: color 0.5s;
}
</style>
