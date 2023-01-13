<template>
    <div>
        <h1>Home</h1>
        {{ user }}
        <button @click="fetchUser">Fetch user</button>
        <button @click="handleLogout">Logout</button>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" })

const { logout, fetchUser, user } = useDirectusAuth()

async function handleLogout() {
    await logout()
}
</script>