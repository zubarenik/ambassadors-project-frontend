<template>
  <AppInput ref="inputRef" v-model="value" :filled="Number.isInteger(value) || Boolean(value)" :invalid="invalid">
    <template #errors>
      {{ errorMessage }}
    </template>
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </AppInput>
</template>

<script lang="ts" setup>
import { computed, toRef, ref, watch, onMounted, nextTick } from 'vue';
import { useField, useIsFieldTouched } from 'vee-validate';

interface InputProps {
  name: string;
  modelValue?: string | number | null;
}

const props = defineProps<InputProps>();

defineEmits<{
  (event: 'update:modelValue', value: string | number | null): void;
}>();

const name = toRef(props, 'name');
const { value, errorMessage, setTouched } = useField<string | number | null>(name, undefined, {
  validateOnValueUpdate: false,
  syncVModel: true,
});

const isTouched = useIsFieldTouched(name);
const invalid = computed<boolean>(() => isTouched.value && Boolean(errorMessage.value));
const inputRef = ref<HTMLInputElement>();

watch(
  () => value.value,
  () => {
    if (!isTouched.value) {
      setTouched(true);
    }
  }
);

onMounted(() => {
  nextTick(() => setTouched(false));
});

defineExpose({
  focus() {
    inputRef.value?.focus();
  },
});
</script>
