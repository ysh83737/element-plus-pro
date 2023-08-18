<script lang="ts">
import { ElTooltip, ElTooltipProps } from 'element-plus';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

/**
 * 判断目标元素是否处于 Clamped 状态
 * @param elm 目标元素
 */
function isTextClamped(elm: Element) {
  return elm.scrollHeight > elm.clientHeight;
}

/** 自适应的超长文本展示，超长时会显示省略号，并且可以展示tooltip */
export default {
  name: 'ElpLineClampText',
};
</script>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
      /** 展示文本 */
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      text?: any;
      /** 展示行数，默认1 */
      lineClamp?: number;
      /** ElTooltip 的配置 */
      tooltip?: Partial<ElTooltipProps>;
    }>(),
  {
    text: undefined,
    lineClamp: 1,
    tooltip: undefined,
  },
);

/** 是否处于 Clamped 状态 */
const clamped = ref(false);
const elRef = ref<Element>(null as never);

let resizeObserver = new ResizeObserver((event) => {
  clamped.value = isTextClamped(event[0].target);
});
onMounted(() => {
  resizeObserver.observe(elRef.value);
});
onBeforeUnmount(() => {
  resizeObserver.unobserve(elRef.value);
  resizeObserver.disconnect();
  resizeObserver = null as never;
});

const styles = computed(() => `--elp-line-clamp-text-count: ${props.lineClamp}`);
</script>
<template>
  <ElTooltip
    :content="text"
    placement="bottom"
    :disabled="!clamped"
    popper-class="elp-line-clamp-text__popper"
    v-bind="tooltip"
  >
    <span
      ref="elRef"
      class="elp-line-clamp-text"
      v-bind="$attrs"
      :style="styles"
    >
      {{ text }}
    </span>
  </ElTooltip>
</template>
