<template>
  <div>
    <h1>Index</h1>
    <NuxtLink to="/auth/login">
      Login
    </NuxtLink>
    <NuxtLink to="/auth/register">
      Register
    </NuxtLink>
  </div>
</template>

<script setup>
import { definePageMeta } from '#imports'

definePageMeta({ middleware: 'guest' })
</script>
