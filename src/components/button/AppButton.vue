<template>
  <span class="app-button-wrapper body-bold font-on-color">
    <button
      v-if="!routerLink && !link"
      class="app-button"
      data-test="app-button"
      :class="classNames"
      :disabled="disabled"
      :data-test-id="testId"
    >
      <slot />
    </button>

    <RouterLink v-if="routerLink" class="app-button" :class="classNames" :to="routerLink" :data-test-id="testId">
      <slot />
    </RouterLink>

    <a v-if="link" class="app-button" :class="classNames" :href="link" :data-test-id="testId" target="_blank">
      <slot />
    </a>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouteLocationRaw } from 'vue-router';

interface ButtonProps {
  link?: string;
  routerLink?: string | Partial<RouteLocationRaw>;
  small?: boolean;
  xsmall?: boolean;
  large?: boolean;
  xlarge?: boolean;
  raised?: boolean;
  disabled?: boolean;
  secondary?: boolean;
  accent?: boolean;
  reversed?: boolean;
  stroked?: boolean;
  round?: boolean;
  transparent?: boolean;
  uppercase?: boolean;
  chips?: boolean;
  testId?: string;
  classes?: string;
  icon?: boolean;
  withIcon?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  small: false,
  xsmall: false,
  large: false,
  xlarge: false,
  raised: false,
  disabled: false,
  secondary: false,
  accent: false,
  reversed: false,
  stroked: false,
  round: false,
  transparent: false,
  uppercase: false,
  chips: false,
  classes: '',
  icon: false,
  withIcon: false,
});

const classNames = computed(() => {
  return {
    'app-button--sm subheadline-bold': props.small,
    'app-button--x-sm': props.xsmall,
    'app-button--lg': props.large,
    'app-button--x-lg': props.xlarge,
    'app-button--raised': props.raised,
    'app-button--disabled': props.disabled,
    'app-button--secondary font-on-white': props.secondary,
    'app-button--accent': props.accent,
    'app-button--stroked font-on-white': props.stroked,
    'app-button--reversed': props.reversed,
    'app-button--round': props.round,
    'app-button--transparent font-on-white': props.transparent,
    'app-button--uppercase': props.uppercase,
    'app-button--chips': props.chips,
    'app-button--icon': props.icon,
    'app-button--with-icon': props.withIcon,
    [props.classes]: Boolean(props.classes),
  };
});
</script>

<style lang="scss">
.app-button-wrapper {
  position: relative;
  display: inline-block;
}

.app-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 24px;
  border-radius: 20px;
  white-space: nowrap;
  text-decoration: none;
  background-color: var(--primary-color);
  color: var(--font-primary);
  box-shadow: none;
  border: 2px solid transparent;
  transition:
    background-color 0.3s ease-in-out,
    border-color 0.3s ease-in-out,
    color 0.3s ease-in-out,
    opacity 0.3s ease-in-out,
    filter 0.3s ease-in-out;
  cursor: pointer;
  --hover-lay-color: white;

  &::after {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0;
    border-radius: inherit;
    background-color: var(--hover-lay-color);
    transition: opacity 0.25s ease-in-out;
  }

  & path {
    transition: 0.3s ease-in-out fill;
  }

  &:hover {
    text-decoration: none;

    &::after {
      opacity: 0.3;
    }
  }

  &--uppercase {
    text-transform: uppercase;
  }

  &--round {
    justify-content: center;
    border-radius: 100%;
  }

  &--raised {
    border-color: transparent;
  }

  &--transparent {
    background-color: theme('colors.transparent');

    &:focus,
    &:hover,
    &:active {
      background-color: theme('colors.transparent');
    }
  }

  &--accent {
    background-color: var(--accent-color);

    &:focus,
    &:hover,
    &:active {
      background-color: var(--accent-color);
    }
  }

  &--with-icon .app-svg-icon {
    font-size: 22px;
    margin-top: -0.125rem;
    margin-bottom: -0.125rem;
  }

  &--disabled {
    box-shadow: none;
    cursor: default;
  }
}
</style>
