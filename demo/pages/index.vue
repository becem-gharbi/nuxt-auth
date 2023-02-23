<template>
    <div class="flex gap-4 m-4">
        <NuxtLink to="/auth/login" class="no-underline"><n-button type="info">Login</n-button></NuxtLink>
        <NuxtLink to="/auth/register" class="no-underline"> <n-button type="primary">Register</n-button></NuxtLink>
    </div>
</template>

<script setup>
definePageMeta({
    middleware: "guest"
})
</script>