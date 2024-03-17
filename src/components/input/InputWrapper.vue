<template>
  <div :class="['relative', { 'flex items-center': $slots.labelLeft }]">
    <div class="subheadline-bold mb-2 text-start text-font-primary empty:hidden" data-test-id="app-input-label">
      <slot name="label" />
    </div>

    <div
      v-if="$slots.labelLeft"
      class="subheadline-bold mr-2 text-start text-font-primary"
      data-test-id="app-input-label"
    >
      <slot name="labelLeft" />
    </div>

    <div
      class="app-input-wrapper body font-on-white text-wrapping"
      data-test-id="app-input-wrapper"
      :class="{
        'app-input-wrapper--light': light,
        'app-input-wrapper--disabled': disabled,
        'app-input-wrapper--small': small,
        'app-input-wrapper--invalid': invalid,
        'app-input-wrapper--filled body-bold': filled,
        'app-input-wrapper--has-prefix': $slots.prefix,
        'app-input-wrapper--has-postfix': $slots.postfix || clearable,
      }"
    >
      <div class="app-input-prefix" data-test-id="app-input-prefix">
        <slot name="prefix" :focused="focused" :filled="filled" :debounced="debounced" />
      </div>

      <slot name="field" />

      <AppLoader v-if="loading" :size="20" :width="2" rotating class="app-input-loading" />

      <div v-else class="app-input-postfix" data-test-id="app-input-postfix">
        <slot name="postfix">
          <AppIcon v-if="clearable" name="x" data-test-id="app-clear-button" @click="$emit('clear')" />
        </slot>
      </div>
    </div>

    <div v-if="invalid" class="app-input-wrapper_errors subheadline-bold absolute top-full text-start text-alert-alarm">
      <slot name="errors" />
    </div>
    <div
      v-else-if="$slots.warnings"
      class="app-input-wrapper_errors subheadline-bold absolute top-full text-start text-alert-warning"
    >
      <slot name="warnings" />
    </div>
  </div>
</template>

<script lang="ts" setup>
interface InputProps {
  loading?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  filled?: boolean;
  light?: boolean;
  small?: boolean;
  clearable?: boolean;
  focused?: boolean;
  debounced?: boolean;
}

withDefaults(defineProps<InputProps>(), {
  loading: false,
  disabled: false,
  invalid: false,
  filled: false,
  light: false,
  small: false,
  clearable: false,
  focused: false,
  debounced: false,
});

defineEmits<{
  (event: 'clear'): void;
}>();
</script>

<style lang="scss" scoped>
.app-input-wrapper {
  position: relative;
  width: 100%;

  & :slotted(.app-input) {
    text-overflow: ellipsis;
    appearance: none;
    flex-grow: 1;

    width: 100%;
    height: 56px;

    background-color: #6F67CF;
    border-radius: 10px;
    padding: 16px;
    border: 2px solid transparent;

    &::placeholder {
      color: #C6C2EB;
    }

    &:focus {
      border-color: white;
      outline: 2px solid transparent;
      outline-offset: 2px;
    }
  }

  &--small :slotted(.app-input) {
    height: 44px;
    border-radius: 10px;
    padding: 12px;
  }

  &--light :slotted(.app-input) {
    background: white;
  }

  &--invalid :slotted(.app-input) {
    background-color: theme('colors.pastel-alert.error');
    border-color: theme('colors.alert.alarm');
  }

  &--filled :slotted(.app-input) {
    color: var(--font-primary);

    &::placeholder {
      font-family: 'Graphik Regular';
    }
  }

  &--has-prefix :slotted(.app-input) {
    padding-left: 40px;
  }

  &--has-postfix :slotted(.app-input) {
    padding-right: 40px;
  }

  .app-input-loading {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(-50%, -50%);
  }

  .app-input-prefix {
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
    color: var(--font-primary);
    font-size: 17px;

    &:empty {
      display: none;
    }
  }

  .app-input-postfix {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(-50%, -50%);
    cursor: pointer;
    color: var(--font-primary);
    font-size: 17px;

    &:empty {
      display: none;
    }
  }

  &:has(.app-input[data-disabled='true']) {
    cursor: not-allowed;
  }
}
</style>
