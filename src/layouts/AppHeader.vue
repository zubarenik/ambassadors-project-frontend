<template>
  <div class="header text-primary">
    <AppIcon name="geo" class="text-7xl" />

    <AppIcon v-if="!open" name="menu" class="block text-3xl md:hidden" @click="() => (open = true)" />
    <AppIcon v-if="open" name="x" class="block text-3xl md:hidden" @click="() => (open = false)" />

    <div class="hidden w-fit items-center justify-between gap-10 font-medium md:flex">
      <RouterLink v-for="link in links" :key="link.name" :to="link.path" class="text-xl">{{ link.name }}</RouterLink>
    </div>

    <div
      v-if="open"
      class="absolute bottom-0 left-0 right-0 top-[80px] z-30 flex h-[calc(100vh-80px)] w-full flex-col bg-white px-3 pb-10 md:hidden"
    >
      <div class="flex flex-grow flex-col items-end justify-center gap-5">
        <RouterLink
          v-for="link in links"
          :key="link.name"
          :to="link.path"
          class="text-3xl font-semibold"
          @click="close"
        >
          {{ link.name }}
        </RouterLink>
      </div>

      <div class="flex flex-col items-center justify-center text-center">
        <b class="text-2xl">{{ 'Подпишись и открой мир!' }}</b>
        <p class="w-3/4">
          {{ 'Будь в курсе последних новостей, узнавай об увлекательных приключениях! Подпишись сейчас!' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

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
    path: { name: 'ambassador-winners' },
  },
];

const open = ref(false);

const close = () => {
  setTimeout(() => (open.value = false), 300);
};
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
