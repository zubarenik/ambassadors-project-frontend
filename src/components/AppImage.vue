<template>
  <img
    v-show="src && !isError"
    :src="src"
    v-bind="$attrs"
    @load="() => (isError = false)"
    @error="() => (isError = true)"
  />
  <slot v-if="!src || isError" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface Props {
  src: string;
}

defineProps<Props>();

const isError = ref<boolean>(false);
</script>
