<template>
  <AppTextarea ref="input" v-model="value" :filled="Boolean(value)" :invalid="invalid">
    <template #errors>
      {{ errorMessage }}
    </template>

    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </AppTextarea>
</template>

<script lang="ts" setup>
import { computed, toRef, watch, onMounted, nextTick, ref } from 'vue';
import { useField, useIsFieldTouched } from 'vee-validate';
import AppTextarea from '../input/AppTextarea.vue';

interface InputProps {
  name: string;
  modelValue?: string;
}

const props = defineProps<InputProps>();

defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const input = ref<InstanceType<typeof AppTextarea>>();
const name = toRef(props, 'name');
const { value, errorMessage, setTouched } = useField<string>(name, undefined, {
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

onMounted(() => {
  nextTick(() => setTouched(false));
});

defineExpose({
  focus() {
    input.value?.focus();
  },
});
</script>
