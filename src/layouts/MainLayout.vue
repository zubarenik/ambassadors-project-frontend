<template>
  <!-- <AppLoader /> -->

  <!-- begin::Body -->
  <div class="page flex flex-row">
    <AppHeader />

    <!-- begin::Content -->
    <div class="content app-scroll-bar" id="content">
      <!-- begin::Content Body -->
      <div>
        <router-view v-slot="{ Component }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" />
          </Transition>
        </router-view>
      </div>
      <!-- end::Content Body -->

      <AppFooter />
    </div>
    <!-- end::Content -->
  </div>
  <!-- end::Body -->

  <!-- <KTScrollTop /> -->
</template>

<script setup lang="ts">
import AppHeader from '@/layouts/AppHeader.vue';
import AppFooter from './AppFooter.vue';
</script>

<style lang="scss" scoped>
.page {
  padding-top: var(--header-h-lg);
}
.content {
  width: 100%;
  overflow: auto;
  height: calc(100vh - var(--header-h-lg));
}
</style>
