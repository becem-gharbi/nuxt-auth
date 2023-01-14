<template>
  <div>
    <NuxtPage></NuxtPage>
  </div>
</template>

<script setup lang="ts">
interface Country {
  id: Number;
  date_created: string;
  date_updated: string | null;
  name: string;
  flag: string
}
</script>