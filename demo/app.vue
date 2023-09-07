<template>
  <h3>Version {{ devDependencies["@bg-dev/nuxt-auth"] }}</h3>
  <NuxtPage />
</template>

<script setup>
import { devDependencies } from "./package.json"
</script>