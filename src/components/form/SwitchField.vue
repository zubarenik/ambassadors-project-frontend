<template>
  <AppSwitch v-model="value" @change="(value: boolean) => emit('change', value)">
    <slot />
  </AppSwitch>
</template>

<script setup lang="ts">
import { toRef } from 'vue';
import { useField } from 'vee-validate';

interface Props {
  name: string;
  modelValue?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'change', value: boolean): void;
}>();

const name = toRef(props, 'name');
const { value } = useField<boolean>(name, undefined, {
  validateOnValueUpdate: false,
  syncVModel: true,
});
</script>
