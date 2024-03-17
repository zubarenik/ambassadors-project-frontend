<template>
  <svg :class="className">
    <use :href="url" />
  </svg>
</template>

<script setup lang="ts">
interface IProps {
  name: string;
}

const props = defineProps<IProps>();
const className = `app-svg-icon app-svg-icon--${props.name}`;
const url = `#icon-${props.name}`;
</script>

<style lang="scss">
.app-svg-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>
