<template>
  <AppSelect v-model="value" :filled="Boolean(value)" :invalid="invalid">
    <template #errors>
      {{ errorMessage }}
    </template>

    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </AppSelect>
</template>

<script lang="ts" setup>
import type { IDataSelect } from '@/core/types/base';
import { computed, toRef, watch } from 'vue';
import { useField, useIsFieldTouched } from 'vee-validate';

type OptionValue = IDataSelect | IDataSelect[] | null;

interface InputProps {
  name: string;
  modelValue?: OptionValue;
}

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: null,
});

defineEmits<{
  (event: 'update:modelValue', value: OptionValue): void;
}>();

const name = toRef(props, 'name');
const { errorMessage, setTouched, value } = useField<OptionValue>(name, undefined, {
  validateOnValueUpdate: false,
  syncVModel: true,
});

const isTouched = useIsFieldTouched(name);
const invalid = computed<boolean>(() => isTouched.value && Boolean(errorMessage.value));

watch(
  () => value.value,
  () => {
    if (!isTouched.value) {
      setTouched(true);
    }
  }
);
</script>
