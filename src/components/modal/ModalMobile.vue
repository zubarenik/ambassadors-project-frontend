<template>
  <div
    class="absolute inset-0 z-0 flex items-end rounded-inherit px-3 pb-7"
    style="background-color: rgba(0, 0, 0, 0.5)"
    @click="$emit('hide')"
  >
    <div
      class="text-wrapping w-full overflow-hidden rounded-lg bg-background-primary"
      :class="classes"
      style="max-height: 572px"
      @click.stop
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineEmits<{
  (event: 'hide'): void;
}>();

interface Props {
  classes?: string;
}

defineProps<Props>();
</script>
