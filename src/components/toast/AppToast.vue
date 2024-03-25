<template>
  <div :class="['app-toast subheadline-bold text-font-primary flex items-center px-5 py-4', stylesByModes[mode].class]">
    <AppIcon :name="stylesByModes[mode].icon" class="app-toast_icon text-3xl -translate-y-px" />
    <span class="mx-3 whitespace-pre-line font-bold" :class="stylesByModes[mode].text">{{ text }}</span>
    <AppIcon name="x" class="text-title-2md -translate-y-px cursor-pointer" @click="$emit('close-toast')" />
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
  [AppToastModes.SUCCESS]: { icon: 'check-circle-filled', class: '', text: 'text-[#48c1b5]' },
  [AppToastModes.ERROR]: { icon: 'x', class: 'app-toast--error', text: 'text-[red]' },
  [AppToastModes.WARNING]: { icon: 'alert-circle', class: 'app-toast--warning', text: '' },
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
  border-bottom-left-radius: theme('borderRadius.xl');
  border-bottom-right-radius: theme('borderRadius.xl');

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
