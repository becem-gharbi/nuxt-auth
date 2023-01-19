<template>
    <div>
        <h1>Home</h1>
        <button @click="fetchUser">Fetch user</button>
        <button @click="handleLogout">Logout</button>
    </div>
</template>

<script setup lang="ts">
import { User } from '.prisma/client';

definePageMeta({ middleware: "auth" })

const { logout } = useAuth()

async function fetchUser() {
    const data = await useAuthFetch<User>("/api/auth/me")

    console.log(data)
}


async function handleLogout() {
    await logout()
}
</script>