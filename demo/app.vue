<template>
  <NaiveConfig>
    <n-message-provider>
      <NaiveColorModeSwitch />
      <NuxtPage />
    </n-message-provider>
  </NaiveConfig>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: none;
}

.layout-enter-active,
.layout-leave-active {
  transition: all 0.2s;
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0;
  filter: none;
}
</style>