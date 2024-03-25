<template>
  <div
    :class="[
      'caption inline-flex flex-shrink-0 items-center rounded-xs border-2 py-0.5 text-font-primary',
      border,
      modeClasses[mode],
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface IProps {
  border?: string;
  mode?: 'label' | 'action';
}

withDefaults(defineProps<IProps>(), {
  border: 'border-transparent',
  mode: 'label',
});

const modeClasses = {
  label: 'px-3.5',
  action: 'px-1',
};
</script>
