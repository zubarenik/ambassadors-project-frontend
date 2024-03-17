<template>
  <div class="header text-primary">
    <AppIcon name="geo" class="text-7xl" />
  </div>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
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
