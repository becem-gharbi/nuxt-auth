<template>
    <div>
        <h1>Home</h1>
        <button @click="fetchUser">Fetch user</button>
        <button @click="handleLogout">Logout</button>
        <p>{{ user }}</p>
        <img :src="pictureUrl" height="40" />
    </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth" })

const { logout, fetchUser, useUser } = useAuth()

const user = useUser()

const pictureUrl = computed(() => user.value?.picture || 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541')

async function handleLogout() {
    await logout()
}
</script>