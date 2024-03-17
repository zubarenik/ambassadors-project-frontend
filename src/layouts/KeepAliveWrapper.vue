<template>
  <router-view v-slot="{ Component }">
    <keep-alive :max="5" :include="include"><component :is="Component" /></keep-alive>
  </router-view>
</template>

<script setup lang="ts">
interface IProps {
  include?: string[];
}

defineProps<IProps>();
</script>
