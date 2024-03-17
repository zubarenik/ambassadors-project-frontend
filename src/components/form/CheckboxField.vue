<template>
  <AppCheckbox v-model="value">
    <slot />
  </AppCheckbox>
</template>

<script setup lang="ts">
import { toRef } from 'vue';
import { useField } from 'vee-validate';

type ModelValue = boolean | unknown[];

interface Props {
  name: string;
  modelValue?: ModelValue;
}

const props = defineProps<Props>();

defineEmits<{
  (event: 'update:modelValue', value: ModelValue): void;
}>();

const name = toRef(props, 'name');
const { value } = useField<ModelValue>(name, undefined, {
  validateOnValueUpdate: false,
  syncVModel: true,
});
</script>
