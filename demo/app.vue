<template>
  <div>
    <h3>Version {{ devDependencies["@bg-dev/nuxt-auth"] }}</h3>
    <NuxtPage />
  </div>
</template>

<script setup>
import { devDependencies } from './package.json'
</script>
