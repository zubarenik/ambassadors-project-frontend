<template>
  <InputWrapper
    v-bind="$attrs"
    :disabled="disabled"
    :clearable="clearable"
    :focused="focused"
    :debounced="debounced"
    @clear="clear"
  >
    <template #field>
      <div class="flex">
        <div
          v-if="controls"
          class="absolute flex h-full cursor-pointer select-none items-center p-3 text-title-2md"
          data-test-id="app-input-down-button"
          @click.prevent="addNumber(-1)"
        >
          <AppIcon name="chevron-left" />
        </div>

        <input
          ref="inputRef"
          :value="displayValue"
          :class="['app-input', { 'text-center': controls }]"
          :disabled="disabled"
          :placeholder="placeholder"
          data-test-id="app-input"
          @input="onInput"
          @focus="focused = true"
          @blur="focused = false"
          @keydown.prevent.up="addNumber(1)"
          @keydown.prevent.down="addNumber(-1)"
        />

        <div
          v-if="controls"
          class="absolute right-0 flex h-full cursor-pointer select-none items-center p-3 text-title-2md"
          data-test-id="app-input-up-button"
          @click.prevent="addNumber(1)"
        >
          <AppIcon name="chevron-right" />
        </div>
      </div>
    </template>

    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </InputWrapper>
</template>

<script lang="ts" setup>
import { computed, ref, watch, customRef } from 'vue';
import InputWrapper from './InputWrapper.vue';
import { useDebounceFn } from '@vueuse/core';

type ModelValue = string | number | null;

interface InputProps {
  modelValue?: ModelValue;
  disabled?: boolean;
  placeholder?: string;
  number?: boolean;
  decimal?: boolean;
  min?: number;
  max?: number;
  hideControls?: boolean;
  debounce?: number;
  clearable?: boolean;
}

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: null,
  placeholder: '',
  number: false,
  decimal: false,
  disabled: false,
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  hideControls: false,
  clearable: true,
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: ModelValue): void;
}>();

let _value: ModelValue = null;
const displayValue = customRef<ModelValue>((track, trigger) => {
  return {
    get() {
      track();
      return _value;
    },
    set(newValue) {
      if (newValue === _value) return;
      _value = processValue(newValue);
      trigger();
    },
  };
});
const controls = computed<boolean>(() => !props.disabled && !props.hideControls && (props.number || props.decimal));
const inputRef = ref<HTMLInputElement>();
const focused = ref(false);
const debounced = ref(false);

watch(
  () => props.modelValue,
  (newValue) => {
    updateInnerModel(newValue);
  },
  { immediate: true }
);

const debouncedEmit = useDebounceFn(emitValue, props.debounce);

watch(
  () => displayValue.value,
  (newVal) => {
    if (props.debounce) {
      debounced.value = true;
      debouncedEmit(newVal);
    } else {
      emitValue(newVal);
    }
  },
  { immediate: true }
);

function processValue(newValue: ModelValue) {
  return props.number || props.decimal ? handleNumeric(newValue) : newValue;
}

function updateInnerModel(newValue: ModelValue) {
  displayValue.value = newValue;
}

function onInput(e: Event) {
  const target = e.target as HTMLInputElement;
  updateInnerModel(target.value);
}

function emitValue(newValue: ModelValue) {
  emit('update:modelValue', newValue);

  if (debounced.value) {
    debounced.value = false;
  }
}

const clearable = computed<boolean>(
  () => props.clearable && !props.number && !props.decimal && (!!displayValue.value || displayValue.value == '0')
);

const clear = () => {
  updateInnerModel(null);
};

/**
 ** Numeric type
 */

function handleNumeric(value: ModelValue): number | string | null {
  if (!value && value != '0') {
    return null;
  }

  const number: number | string | null = props.number ? processIntegerValue(value) : processDecimalValue(value);

  if (isEmpty(number)) {
    return null;
  }

  return handleMinMax(number as number | string);
}

function handleMinMax(value: number | string): number | string {
  const _value = typeof value === 'string' ? parseFloat(value) : value;

  if (_value < props.min) {
    return props.min;
  }

  if (_value > props.max) {
    return props.max;
  }

  return value;
}

function processDecimalValue(value: string | number): number | null | string {
  value = '' + value;
  value = value.replace(',', '.');

  const DECIMAL_REGEX = /-?(\d*)\.?(\d*)/;
  const match = value.match(DECIMAL_REGEX);

  if (match === null) {
    return null;
  }

  value = match[0];

  if (
    (value.length >= 2 && value.charAt(0) === '0' && value.charAt(1) !== '.') ||
    (value.length >= 3 && value.charAt(0) === '-' && value.charAt(1) === '0' && value.charAt(2) !== '.')
  ) {
    return String(parseFloat(value));
  }
  return value;
}

function processIntegerValue(value: string | number): number | null {
  const processed = Number(value);

  if (Number.isNaN(processed)) {
    return null;
  }

  return processed;
}

function addNumber(addendum: number) {
  if (!props.number && !props.decimal) {
    return;
  }

  let newVal = (isEmpty(displayValue.value) ? 0 : displayValue.value) as number;

  if (!Number.isInteger(newVal)) {
    const splittedDecimal = ('' + newVal).split('.');
    const beforeDecimalPoint = splittedDecimal[0];
    const afterDecimalPoint = splittedDecimal[1];

    newVal = parseFloat([parseInt(beforeDecimalPoint) + addendum, afterDecimalPoint].join('.'));
  } else {
    newVal = newVal + addendum;
  }

  updateInnerModel(newVal);
}

function isEmpty(value: string | number | null) {
  return !value && value !== 0 && value != '0';
}

defineExpose({
  focus() {
    inputRef.value?.focus();
  },
  displayValue,
});
</script>
