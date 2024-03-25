<template>
  <label :class="['app-checkbox', `app-checkbox--${positionLabel}`]">
    <input
      v-model="value"
      type="checkbox"
      class="app-checkbox_input"
      data-test-id="app-checkbox-input"
      :value="$attrs.value"
      :disabled="Boolean($attrs.disabled)"
    />
    <span class="app-checkbox_label text-white" data-test-id="app-checkbox-slot"><slot /></span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type ModelValue = boolean | undefined | unknown[];

interface Props {
  modelValue?: ModelValue;
  positionLabel?: 'top' | 'bottom' | 'left' | 'right';
}

const props = withDefaults(defineProps<Props>(), {
  positionLabel: 'right',
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: ModelValue): void;
}>();

const value = computed<ModelValue>({
  get() {
    return props.modelValue;
  },
  set(newValue: ModelValue) {
    emit('update:modelValue', newValue);
  },
});
</script>

<style lang="scss" scoped>
.app-checkbox {
  display: inline-flex;
  cursor: pointer;

  &:has(.app-checkbox_input[disabled]) {
    opacity: 0.5;
    cursor: no-drop;
  }

  &_input {
    background-color: white;
    border: 2px solid white;
    border-radius: 5px;
    flex: 0 0 auto;
    height: 24px;
    width: 24px;
    -webkit-appearance: none;
    appearance: none;
    cursor: inherit !important;
    transition:
      border 0.3s ease-in-out,
      background-color 0.3s ease-in-out;

    &:after {
      position: relative;
      top: 4px;
      left: 11px;
      display: block;
      width: 7px;
      height: 12px;
      border-right: 2px solid #ffffff;
      border-bottom: 2px solid #ffffff;
      opacity: 0;
      content: '';
      transition:
        transform 0.2s ease-in-out,
        opacity 0.25s ease-in-out;
      transform: rotate(45deg) translate(4px, 3px);
      transform-origin: top;
    }

    &:checked {
      border-color: white;
      background-color: var(--primary-color);

      &:after {
        opacity: 1;
        transform: rotate(45deg) translate(0px, 0px);
      }
    }
  }

  &_label {
    &:empty {
      display: none;
    }
  }

  &--right {
    .app-checkbox_label {
      width: 100%;
      margin-left: 8px;
    }
  }
}
</style>
