<template>
  <div v-if="!isOverflown" ref="contentRef">
    <slot />
  </div>

  <AppPopover v-else event-on-hover :position="position">
    <template #reference>
      <div class="line-clamp-2">
        <slot />
      </div>
    </template>
    <template #content>
      <div class="text-wrapping caption max-w-xs rounded-sm bg-dark-blue-1 px-3 py-2 text-dark-blue-primary">
        <slot name="popover-content" />
      </div>
    </template>
  </AppPopover>
</template>

<script lang="ts" setup>
import AppPopover from './AppPopover.vue';
import { ref, onUpdated, onMounted } from 'vue';

interface Props {
  position?: string;
}

defineProps<Props>();

const contentRef = ref<HTMLElement | null>(null);
const isOverflown = ref<boolean>(false);

const setup = () => {
  if (!contentRef.value) {
    return;
  }

  const { scrollHeight, clientHeight, scrollWidth, clientWidth } = contentRef.value;

  isOverflown.value = scrollHeight > clientHeight || scrollWidth > clientWidth;
};

onUpdated(() => {
  setup();
});

onMounted(() => {
  setup();
});
</script>
