<template>
  <div class="header text-primary">
    <AppIcon name="geo" class="text-7xl" />

    <div class="flex w-fit items-center justify-between gap-10 font-medium">
      <RouterLink v-for="link in links" :key="link.name" :to="link.path" class="text-xl">{{ link.name }}</RouterLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
const links = [
  {
    name: 'О проекте',
    path: { name: 'welcome-page' },
  },
  {
    name: 'Голосование',
    path: { name: 'ambassadors' },
  },
  {
    name: 'Результаты',
    path: { name: 'welcome-page' },
  },
];
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 11;

  height: var(--header-h-lg);
  padding: 0 32px;
}
</style>
