<template>
  <div class="w-full">
    <slot
      :valid="isFormValid"
      :values="values"
      :set-errors="setErrors"
      :set-values="setValues"
      :reset="reset"
      :submit="submit"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, watch, ref, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import { AnySchema, ValidationError } from 'yup';
import isEqual from 'lodash.isequal';

interface FormProps {
  modelValue?: Record<string, unknown>;
  schema?: AnySchema;
  initState?: Record<string, unknown>;
}

const props = defineProps<FormProps>();
const schema = computed(() => props.schema);

const emit = defineEmits<{
  (event: 'update:model-value', values: Record<string, unknown>): void;
  (event: 'validation', valid: boolean): void;
}>();

const { values, setErrors, setValues, resetForm, validate: fakeValidation } = useForm();

/**
 ** Validation.
 */

const isFormValid = ref<boolean>(false);

const validate = async (newValues: Record<string, unknown>) => {
  await fakeValidation();

  setErrors({});
  isFormValid.value = true;

  if (!schema.value) {
    return;
  }

  try {
    schema.value.validateSync(newValues, {
      abortEarly: false,
    });
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      const errors: Record<string, string> = {};

      error.inner.forEach((err: ValidationError) => {
        errors[err.path as string] = err.message;
      });

      setErrors(errors);
      isFormValid.value = false;
    }
  }

  emit('validation', isFormValid.value);
};

/**
 ** Reset.
 */

const savedInitState = ref<Record<string, unknown> | null>(null);

const updateInitState = (newState?: Record<string, unknown>) => {
  if (!newState) {
    savedInitState.value = null;
    return;
  }

  savedInitState.value = {
    ...newState,
  };
};

const reset = (newState?: Record<string, unknown>) => {
  const state = newState ? newState : savedInitState.value ? savedInitState.value : {};

  resetForm({
    values: { ...state },
  });
};

/**
 ** Submit.
 */

const submit = (updatedValues: Record<string, unknown>) => {
  updateInitState(updatedValues);
};

const updateValues = (newValues: Record<string, unknown>) => {
  if (!isEqual(values, newValues)) {
    setValues({ ...newValues });
  }
};

watch(
  () => props.modelValue,
  (newValues) => {
    if (newValues) {
      updateValues(newValues);
    }
  }
);

watch(
  () => values,
  async (newValues) => {
    await validate(newValues);

    if (isEqual(newValues, props.modelValue)) return;

    emit('update:model-value', { ...newValues });
  },
  { deep: true }
);

onMounted(() => {
  if (props.modelValue) {
    updateValues(props.modelValue);
  }

  updateInitState(props.initState || props.modelValue);
});

defineExpose({
  reset,
  submit,
  isValid(): boolean {
    return isFormValid.value;
  },
});
</script>
