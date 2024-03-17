<template>
  <div style="max-width: 60vw">
    <p class="title-28-bold mx-auto mb-4">
      {{ title }}
    </p>

    <p v-if="subTitle" class="title-20-bold">
      {{ subTitle }}
    </p>

    <div class="mt-12 flex gap-4">
      <AppButton v-if="!onlyConfirm" secondary class="flex-1" @click="emit('close')">
        {{ cancel || t('cancel') }}
      </AppButton>

      <AppButton :disabled="pendingAction" class="flex-1" @click="emit('action')">
        {{ action }}
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ModalConfirmProps } from '@/components/modal/types';
import { useI18n } from 'vue-i18n';

defineProps<ModalConfirmProps>();

const emit = defineEmits<{
  (event: 'action'): void;
  (event: 'close'): void;
}>();

const { t } = useI18n();
</script>
