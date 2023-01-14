<template>
    <div>
        <h1>Home</h1>
        <button @click="fetchUser">Fetch user</button>
        <button @click="handleLogout">Logout</button>
    </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" })

const { logout, fetchUser } = useAuth()

async function handleLogout() {
    await logout()
}
</script>