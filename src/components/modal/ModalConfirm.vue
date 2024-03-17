<template>
  <ModalWrapper
    class="text-center"
    :close-button="false"
    :content-classes="type === ModalConfirmTypes.DEFAULT ? '' : 'bg-white'"
    @close="clickToClose && emit('close')"
  >
    <component :is="components[type]" v-bind="$props" @action="onAction" @close="emit('close')" />
  </ModalWrapper>
</template>

<script setup lang="ts">
import ModalWrapper from '@/components/modal/ModalWrapper.vue';
import type { ModalConfirmProps } from '@/components/modal/types';
import { ModalConfirmTypes } from '@/components/modal/types';
import ModalConfirmDefault from '@/components/modal/ModalConfirmDefault.vue';
import ModalConfirmWithIcon from '@/components/modal/ModalConfirmWithIcon.vue';
import { ref } from 'vue';

withDefaults(defineProps<ModalConfirmProps>(), {
  action: 'OK',
  type: ModalConfirmTypes.DEFAULT,
  clickToClose: true,
});

const emit = defineEmits<{
  (event: 'action', cb: (pending: boolean) => void): void;
  (event: 'close'): void;
}>();

const pendingAction = ref(false);
const components = {
  [ModalConfirmTypes.DEFAULT]: ModalConfirmDefault,
  [ModalConfirmTypes.SUCCESS]: ModalConfirmWithIcon,
  [ModalConfirmTypes.ERROR]: ModalConfirmWithIcon,
  [ModalConfirmTypes.WARNING]: ModalConfirmWithIcon,
};

function onAction() {
  emit('action', (pending: boolean) => {
    pendingAction.value = pending;
  });
}
</script>
