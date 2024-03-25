<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between">
      <slot name="label" />

      <div class="flex space-x-2">
        <AppButton v-if="needDelete" xsmall secondary @click="emit('delete')" classes="bg-dark-blue-2">
          <AppIcon name="trash-02" class="-m-px -mt-0.5 text-text-sm text-dark-blue-5" />
        </AppButton>
        <AppButton v-if="needMove" xsmall secondary @click="emit('move-down')" classes="bg-dark-blue-2">
          <AppIcon name="arrow-down" class="-m-px -mt-0.5 text-text-sm text-dark-blue-5" />
        </AppButton>
        <AppButton v-if="needMove" xsmall secondary @click="emit('move-up')" classes="bg-dark-blue-2">
          <AppIcon name="arrow-up" class="-m-px -mt-0.5 text-text-sm text-dark-blue-5" />
        </AppButton>
      </div>
    </div>

    <slot />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  needMove?: boolean;
  needDelete?: boolean;
}

withDefaults(defineProps<Props>(), {
  needMove: true,
  needDelete: true,
});

const emit = defineEmits<{
  (event: 'delete'): void;
  (event: 'move-up'): void;
  (event: 'move-down'): void;
}>();
</script>
