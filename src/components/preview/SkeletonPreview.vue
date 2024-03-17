<template>
  <div v-if="!wrapping" :style="style" />
  <div v-else class="h-fit w-full space-y-2">
    <div v-for="wrap in wrapsAmount" :key="wrap" :style="styleWrap[wrap - 1]" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface Props {
  height?: string;
  width?: string;
  wrapping?: boolean;
  wrapsAmount?: number;
  wrapsGap?: string;
  wrapsStairs?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  height: '100%',
  width: '100%',
  wrapping: false,
  wrapsAmount: 2,
  wrapsGap: '30%',
  wrapsStairs: false,
});

const style = computed(() => {
  return [
    `height: ${props.height}; width: ${props.width}; border-radius: 12px; background-color: #E6E6E6`,
    props.wrapping ? 'border-radius: 4px' : '',
  ];
});

const styleWrap = computed(() => {
  const result = [];

  for (let index = 0; index < props.wrapsAmount; index++) {
    const additionalStyle = [`width: calc(100% - ${index} * ${props.wrapsGap})`];
    const wrapStyle =
      props.wrapsStairs || index === props.wrapsAmount - 1 ? style.value.concat(additionalStyle) : style.value;

    result.push(wrapStyle);
  }

  return result;
});
</script>
