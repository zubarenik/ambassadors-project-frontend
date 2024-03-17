<template>
  <div :class="['-m-5 rounded-md border-2 p-10', colorClasses[type]]" style="max-width: 60vw; min-width: 36vw">
    <AppIcon :name="iconNames[type]" :class="colorClasses[type]" style="font-size: 88px" />

    <p :class="['large-title-bold mx-auto mb-4 mt-10', colorClasses[type]]" style="max-width: 80%">
      {{ title }}
    </p>

    <p v-if="subTitle" class="title-22-bold text-font-primary">
      {{ subTitle }}
    </p>

    <div class="mt-10 flex justify-center">
      <AppButton :disabled="pendingAction" :secondary="onlyConfirm" @click="emit('action')">
        {{ action }}
      </AppButton>

      <AppButton v-if="!onlyConfirm" secondary class="ml-4" @click="emit('close')">
        {{ cancel || t('cancel') }}
      </AppButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { ModalConfirmProps } from '@/components/modal/types';
import { ModalConfirmTypes } from '@/components/modal/types';

type InputProps = ModalConfirmProps & {
  type: ModalConfirmTypes.SUCCESS | ModalConfirmTypes.ERROR | ModalConfirmTypes.WARNING;
};

withDefaults(defineProps<InputProps>(), { type: ModalConfirmTypes.SUCCESS });

const emit = defineEmits<{
  (event: 'action'): void;
  (event: 'close'): void;
}>();

const iconNames = {
  [ModalConfirmTypes.SUCCESS]: 'check-circle-filled',
  [ModalConfirmTypes.ERROR]: 'x-octagon',
  [ModalConfirmTypes.WARNING]: 'alert-circle',
};
const colorClasses = {
  [ModalConfirmTypes.SUCCESS]: 'text-alert-success border-alert-success',
  [ModalConfirmTypes.ERROR]: 'text-alert-error border-alert-error',
  [ModalConfirmTypes.WARNING]: 'text-alert-warning border-alert-warning',
};
const { t } = useI18n();
</script>
