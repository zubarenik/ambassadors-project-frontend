<template>
  <div :class="['app-toast subheadline-bold flex items-center px-5 py-4 text-font-primary', stylesByModes[mode].class]">
    <AppIcon :name="stylesByModes[mode].icon" class="app-toast_icon -translate-y-px text-title-2md" />
    <span class="mx-3 whitespace-pre-line font-bold">{{ text }}</span>
    <AppIcon name="x" class="-translate-y-px cursor-pointer text-title-2md" @click="$emit('close-toast')" />
  </div>
</template>

<script setup lang="ts">
import { AppToastModes } from '@/core/plugins/useAppToast';

interface IProps {
  text: string;
  mode: AppToastModes;
}

defineProps<IProps>();

const stylesByModes = {
  [AppToastModes.SUCCESS]: { icon: 'check-circle-filled', class: '' },
  [AppToastModes.ERROR]: { icon: 'x', class: 'app-toast--error' },
  [AppToastModes.WARNING]: { icon: 'alert-circle', class: 'app-toast--warning' },
};
</script>

<style lang="scss">
$toast-container-padding: 4px;
$page-padding: 2.5rem;

.app-toast {
  --bg-color: #f6fff9;
  --main-color: #48c1b5;
  background-color: var(--bg-color);
  border: 1px solid var(--main-color);
  border-bottom-left-radius: theme('borderRadius.sm');
  border-bottom-right-radius: theme('borderRadius.sm');

  &_icon {
    color: var(--main-color);
  }

  &-container.top-right {
    top: calc(var(--header-h-lg) - $toast-container-padding) !important;
    right: calc($page-padding + $toast-container-padding) !important;
  }

  &--error {
    --bg-color: #fff5f3;
    --main-color: #f4b0a1;
  }

  &--warning {
    --bg-color: #fff8ec;
    --main-color: #ffc46b;
  }
}
</style>
