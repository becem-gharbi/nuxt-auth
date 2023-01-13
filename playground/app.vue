<template>
  <div>
    <h2>{{ data?.data[0].flag }}</h2>
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
const { data } = await useDirectusFetch<Country[]>("items/country")
</script>