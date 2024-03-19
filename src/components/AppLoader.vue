<template>
  <svg
    :width="size"
    :height="size"
    :viewBox="viewBox"
    class="app-loader"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle :cx="center" :cy="center" :r="radius" :stroke-width="width" fill="none" stroke="#ebeff2" />
    <circle
      :class="{ rotating: rotating }"
      :cx="center"
      :cy="center"
      :r="radius"
      :stroke-width="width"
      :stroke="strokeColor"
      :stroke-dasharray="dashArray"
      :stroke-dashoffset="dashOffset"
      class="app-loader-value"
      fill="none"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface LoaderProps {
  size?: number;
  width?: number;
  strokeColor?: string;
  progress?: number;
  rotating?: boolean;
}

const props = withDefaults(defineProps<LoaderProps>(), {
  size: 30,
  width: 3,
  strokeColor: 'var(--primary-color)',
  progress: 0.3,
  rotating: false,
});

const viewBox = computed(() => `0 0 ${props.size} ${props.size}`);
const center = computed(() => props.size / 2);
const radius = computed(() => center.value - props.width);
const dashArray = computed(() => 2 * Math.PI * radius.value);
const dashOffset = computed(() => dashArray.value * (1 - props.progress));
</script>

<style lang="scss" scoped>
.app-loader {
  transform: rotate(-90deg);
}

.app-loader-value {
  transition: stroke-dashoffset 0.3s ease-in-out;
  transform-origin: center;
}

.app-loader-value.rotating {
  animation: rotating 0.7s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
