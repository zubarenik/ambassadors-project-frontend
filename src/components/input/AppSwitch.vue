<template>
  <label
    class="subheadline-bold text-font-primary"
    :class="['app-switch', `app-switch--${positionLabel}`, { 'app-switch--small': small }]"
  >
    <input
      v-model="innerModel"
      v-bind="$attrs"
      :style="styles"
      :value="value"
      type="checkbox"
      class="app-switch_input"
      data-test-id="app-switch-input"
      @change="emit('change', innerModel)"
    />
    <span class="app-switch_label" data-test-id="app-switch-slot"><slot /></span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type ModelValue = boolean | undefined | unknown[];

interface Props {
  modelValue?: ModelValue;
  value?: unknown;
  positionLabel?: 'left' | 'right';
  small?: boolean;
  color?: string;
}

defineOptions({ inheritAttrs: false });
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  positionLabel: 'right',
  small: false,
  color: 'var(--primary-color)',
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: ModelValue): void;
  (event: 'change', value: ModelValue): void;
}>();

const innerModel = computed({
  get() {
    return props.modelValue;
  },
  set(newValue: ModelValue) {
    emit('update:modelValue', newValue);
  },
});
const styles = computed(() => {
  const isTrue = Boolean(Array.isArray(innerModel.value) ? innerModel.value.includes(props.value) : innerModel.value);
  return { backgroundColor: isTrue ? props.color : '' };
});
</script>

<style lang="scss">
.app-switch {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  --switch-w: 52px;
  --switch-h: 32px;
  --thumb-size: 28px;

  &:has(.app-switch_input[disabled]) {
    opacity: 0.5;
    cursor: no-drop;
  }

  &_input {
    position: relative;
    width: var(--switch-w);
    height: var(--switch-h);
    border: none;
    border-radius: 36px;
    background-color: var(--font-tertiary);
    outline: none;
    cursor: inherit !important;
    transition: 0.3s background-color;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    &::after {
      position: absolute;
      top: 50%;
      left: 2px;
      display: block;
      width: var(--thumb-size);
      height: var(--thumb-size);
      border-radius: 50%;
      content: '';
      background-color: white;
      transition:
        transform 0.3s ease,
        opacity 0.2s;
      transform: translate(var(--x, 0), -50%);
      border: 0.5px solid rgba(0, 0, 0, 0.04);
      box-shadow:
        0 3px 8px rgba(0, 0, 0, 0.15),
        0 1px 1px rgba(0, 0, 0, 0.16),
        0 3px 1px rgba(0, 0, 0, 0.1);
    }

    &:checked {
      background-color: var(--primary-color);
      --x: 20px;
    }
  }

  &_label {
    &:empty {
      display: none;
    }
  }

  &--right {
    .app-switch_label {
      margin-left: 16px;
    }
  }

  &--left {
    .app-switch_label {
      order: -1;
      margin-right: 16px;
    }
  }

  &--small {
    --switch-w: 39px;
    --switch-h: 24px;
    --thumb-size: 21px;

    .app-switch_input {
      &:checked {
        --x: 14px;
      }
    }
  }
}
</style>
