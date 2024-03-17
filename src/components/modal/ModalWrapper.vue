<template>
  <VueFinalModal content-class="absolute inset-0" overlay-transition="vfm-fade" content-transition="vfm-fade">
    <div class="absolute inset-0 flex h-full overflow-auto" @click.self="clickToClose && emit('close')">
      <div :class="['relative m-auto rounded-lg bg-black p-11 text-font-tertiary', contentClasses]">
        <slot />

        <span
          v-if="closeButton"
          class="absolute right-5 top-5 flex cursor-pointer rounded-md border-2 border-font-secondary p-1 transition hover:brightness-125"
          @click="emit('close')"
        >
          <AppIcon name="x" class="text-title-md text-font-secondary" />
        </span>
      </div>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal';

interface IProps {
  clickToClose?: boolean;
  closeButton?: boolean;
  contentClasses?: string;
}

withDefaults(defineProps<IProps>(), { clickToClose: true, closeButton: true, contentClasses: '' });
const emit = defineEmits<{
  (e: 'close'): void;
}>();
</script>
